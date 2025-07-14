import mitt from "mitt";

import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { StyleFamily } from "./types/StyleFamily.js";
import { deserializeAuthentication } from "./utils/deserializeAuthentication.js";
import { startNewSession } from "./utils/startNewSession.js";
import { Writable } from "./utils/writable.js";
import {
  DEFAULT_DURATION,
  DEFAULT_SAFETY_MARGIN,
  DEFAULT_CHECK_EXPIRATION_INTERVAL
} from "./utils/defaults.js";

export interface IBasemapSessionParams {
  token: string;
  startSessionUrl: string;
  styleFamily: StyleFamily;
  authentication: IAuthenticationManager | string;
  expires: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  safetyMargin?: number;
  duration?: number;
}

export interface IStartSessionParams {
  styleFamily?: StyleFamily;
  authentication: IAuthenticationManager | string;
  saftyMargin?: number;
  testSession?: boolean;
}

/**
 * The base class for all basemap sessions. This class implements the {@linkcode IAuthenticationManager} interface and provides methods to start, refresh, and check the expiration of a session.
 * This is not intendet to be used directly, but instead is extended by other classes such as {@linkcode BasemapStyleSession} and {@linkcode StaticBasemapTilesSession}.
 *
 * @abstract
 * @implements {IAuthenticationManager}
 */
export abstract class BaseSession implements IAuthenticationManager {
  /**
   * Event handler for when a session expires and the `token` it no longer valid.
   *
   * @event expired
   * @param e - The parameters for the expired event.
   * @param e.token - The session token that expired.
   * @param e.startTime - The start time of the session.
   * @param e.endTime - The end time of the session.
   * @param e.expires - The expiration time of the session.
   */
  static readonly expired = function expired(e: {
    token: string;
    startTime: Date;
    endTime: Date;
    expires: Date;
  }): void {}; // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * Event handler for when a session refreshes and a new `token` is available.
   *
   * @event refreshed
   * @param e. - The parameters for the refreshed event.
   * @param e.previous - The previous session details.
   * @param e.previous.token - The previous session token.
   * @param e.previous.startTime - The start time of the previous session.
   * @param e.previous.endTime - The end time of the previous session.
   * @param e.previous.expires - The expiration time of the previous session.
   * @param e.current - The current session details.
   * @param e.current.token - The current session token.
   * @param e.current.startTime - The start time of the current token.
   * @param e.current.endTime - The end time of the current session.
   * @param e.current.expires - The expiration time of the current token.
   */
  static readonly refreshed = function refreshed(e: {
    previous: {
      token: string;
      startTime: Date;
      endTime: Date;
      expires: Date;
    };
    current: {
      token: string;
      startTime: Date;
      endTime: Date;
      expires: Date;
    };
  }): void {}; // eslint-disable-line @typescript-eslint/no-empty-function

  /**
   * The portal URL that the session is associated with. This generally is not used but exists to implement the `IAuthenticationManager` interface.
   */
  readonly portal: string;

  /**
   * The style family of the session. This is used to determine the type of basemap styles that are available.
   */
  readonly styleFamily: StyleFamily;

  /**
   * The authentication manager or token used for the session.
   * This can be an instance of {@linkcode ApiKeyManager}, {@linkcode ArcGISIdentityManager}, {@linkcode ApplicationCredentialsManager} or a string token.
   */
  readonly authentication: IAuthenticationManager | string;

  /**
   * The expiration date of the session. This is the {@linkcode BaseSession.endTime} minus the {@linkcode BaseSession.saftyMargin}. This is used internally to determine if the session is expired.
   */
  readonly expires: Date;

  /**
   * The start time of the session. This is the time returned from the API when the session war started.
   */
  readonly startTime: Date;

  /**
   * The end time of the session. This is the time returned from the API when the session will end.
   */
  readonly endTime: Date;

  /**
   * The token for the session.
   */
  readonly token: string;

  /**
   * The URL used to start the session.
   */
  readonly startSessionUrl: string;

  /**
   * The safety margin in milliseconds. This subtracted from the {@linkcode BaseSession.endTime} to get the {@linkcode BaseSession.expiration}.
   */
  readonly saftyMargin: number;

  /**
   * The duration of the session in seconds. This is used to determine how long the session will last when the session is refreshed.
   */
  readonly duration: number;

  /**
   * The ID of the timer used to check the expiration time of the session.
   */
  private expirationTimerId: any = null;

  /**
   * Internal instance of [`mitt`](https://github.com/developit/mitt) used for event handlers. It is recommended to use {@linkcode BasemapSession.on}, {@linkcode BasemapSession.off} or {@linkcode BasemapSession.once} instead of `emitter.`
   */
  private emitter: any;

  /**
   * Creates a new instance of the BaseSession class. Generally you should not create an instance of this class directly, but instead use the static methods to start a session or deserialize a session.
   *
   * You may need to create an instance of this class directly if you are  not using the built in deserialize method.
   *
   * @param params - The parameters for the session.
   * @param params.startSessionUrl - The URL to start the session.
   * @param params.token - The token for the session.
   * @param params.styleFamily - The style family of the session.
   * @param params.authentication - The authentication manager or token used for the session.
   * @param params.expires - The expiration date of the session.
   * @param params.startTime - The start time of the session.
   * @param params.endTime - The end time of the session.
   * @param params.safetyMargin - The safety margin in milliseconds.
   * @param params.duration - Indicates if this is a test session.
   */
  constructor(params: IBasemapSessionParams) {
    this.startSessionUrl = params.startSessionUrl;
    this.token = params.token;
    this.styleFamily = params.styleFamily || "arcgis";
    this.authentication = params.authentication;
    this.duration = params.duration || DEFAULT_DURATION;
    this.startTime =
      typeof params.startTime === "string"
        ? new Date(params.startTime)
        : params.startTime;
    this.endTime =
      typeof params.endTime === "string"
        ? new Date(params.endTime)
        : params.endTime;
    this.expires =
      typeof params.expires === "string"
        ? new Date(params.expires)
        : params.expires;
    this.saftyMargin = params.safetyMargin || DEFAULT_SAFETY_MARGIN;
    this.emitter = mitt();
    this.startCheckingExpirationTime();
  }

  /**
   * Checks if the session is expired. If it is expired, it emits an "expired" event. The event will fire **before** the method returns true.
   *
   * @returns {boolean} - Returns true if the session is expired, otherwise false.
   */
  isSessionExpired() {
    if (this.isExpired) {
      this.emitter.emit("expired", {
        token: this.token,
        startTime: this.startTime,
        endTime: this.endTime,
        expires: this.expires
      });
    }
    return this.isExpired;
  }

  /**
   * Starts checking the expiration time of the session. This will check the expiration time immediately and then on an interval.
   * If the session is expired, it will emit an "expired" event.
   */
  startCheckingExpirationTime() {
    const check = () => {
      console.log(
        "BaremapStyleSession.startCheckingExpirationTime(): Checking session expiration time..."
      );
      this.isSessionExpired();
    };

    if (!this.expirationTimerId) {
      this.expirationTimerId = setInterval(
        check,
        DEFAULT_CHECK_EXPIRATION_INTERVAL
      ); // check immediatly then on an interval
    }

    setTimeout(() => {
      check(); // check immediately after starting the interval
    }, 10);
  }

  /**
   * Stops checking the expiration time of the session. This will clear the interval that was set by {@linkcode BaseSession.startCheckingExpirationTime}.
   */
  stopCheckingExpirationTime() {
    if (this.expirationTimerId) {
      clearInterval(this.expirationTimerId);
      this.expirationTimerId = null;
    }
  }

  /**
   * Starts a new session using the provided parameters and returns an instance of the session class.
   *
   * @param params - The parameters for starting the session.
   * @param SessionClass - The class to use for the session.
   * @returns A promise that resolves to an instance of the session class.
   */
  protected static async startSession<T extends BaseSession>(
    {
      startSessionUrl,
      styleFamily = "arcgis",
      authentication,
      safetyMargin = DEFAULT_SAFETY_MARGIN,
      duration = DEFAULT_DURATION
    }: {
      startSessionUrl?: string;
      styleFamily?: StyleFamily;
      authentication: IAuthenticationManager | string;
      safetyMargin?: number;
      duration?: number;
    },
    SessionClass: new (params: IBasemapSessionParams) => T
  ): Promise<T> {
    const sessionResponse = await startNewSession({
      startSessionUrl,
      styleFamily,
      authentication,
      duration
    });

    const timeToSubtract = safetyMargin || DEFAULT_SAFETY_MARGIN;

    const session = new SessionClass({
      startSessionUrl: startSessionUrl,
      token: sessionResponse.sessionToken,
      styleFamily,
      authentication,
      safetyMargin: timeToSubtract,
      expires: new Date(sessionResponse.endTime - timeToSubtract),
      startTime: new Date(sessionResponse.startTime),
      endTime: new Date(sessionResponse.endTime),
      duration
    });

    return session as T;
  }

  /**
   * Converts the session parameters to a JSON object.
   *
   * @returns An object containing the session parameters.
   */
  toJSON(): IBasemapSessionParams {
    return {
      startSessionUrl: this.startSessionUrl,
      token: this.token,
      styleFamily: this.styleFamily,
      authentication: this.authentication,
      expires: this.expires,
      safetyMargin: this.saftyMargin,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration
    };
  }

  /**
   * Serializes the session parameters to a JSON string.
   *
   * @returns A JSON string representation of the session parameters.
   */
  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Deserializes a session from a JSON string and returns an instance of the session class.
   *
   * @param serializedBasemapSession - The JSON string to deserialize.
   * @param SessionClass - The class to use for the session.
   * @returns An instance of the session class.
   */
  protected static deserializeSession<T extends BaseSession>(
    serializedBasemapSession: string,
    SessionClass: new (params: IBasemapSessionParams) => T
  ) {
    const params: IBasemapSessionParams = JSON.parse(serializedBasemapSession);
    const authentication = deserializeAuthentication(params.authentication);

    const timeToSubtract = params.safetyMargin || DEFAULT_SAFETY_MARGIN;

    const session = new SessionClass({
      startSessionUrl: params.startSessionUrl,
      token: params.token,
      styleFamily: params.styleFamily,
      authentication,
      expires: params.expires,
      safetyMargin: timeToSubtract,
      startTime: new Date(params.startTime),
      endTime: new Date(params.endTime),
      duration: params.duration || DEFAULT_DURATION
    });

    return session;
  }

  /**
   * Checks if the session is expired.
   *
   */
  get isExpired(): boolean {
    return this.expires < new Date();
  }

  /**
   * Gets the session token. If the session is expired, it will refresh the credentials and return the new token.
   *
   * @returns A promise that resolves to the session token.
   */
  getToken(): Promise<string> {
    if (this.isExpired) {
      console.log(
        "BasmapStyleSession.getToken(): Session expired, refreshing credentials..."
      );
      return this.refreshCredentials().then(() => this.token);
    }

    return Promise.resolve(this.token);
  }

  /**
   * Indicates if the session can be refreshed. This is always true for this class.
   *
   * @returns {boolean} - Always returns true.
   */
  get canRefresh(): boolean {
    return true;
  }

  /**
   * Refreshes the session credentials by starting a new session.
   * This will emit a "refreshed" event with the previous and current session details.
   *
   * @returns A promise that resolves to the current instance of the session.
   */
  async refreshCredentials(): Promise<this> {
    const previous = structuredClone({
      token: this.token,
      startTime: this.startTime,
      endTime: this.endTime,
      expires: this.expires
    });

    const newSession = await startNewSession({
      startSessionUrl: this.startSessionUrl,
      styleFamily: this.styleFamily,
      authentication: this.authentication,
      duration: this.duration
    });

    this.setToken(newSession.sessionToken);
    this.setStartTime(new Date(newSession.startTime));
    this.setEndTime(new Date(newSession.endTime));
    this.setExpires(new Date(newSession.endTime - this.saftyMargin));

    this.emitter.emit("refreshed", {
      previous,
      current: {
        token: this.token,
        startTime: this.startTime,
        endTime: this.endTime,
        expires: this.expires
      }
    });

    return this;
  }

  /**
   * A handler that listens for an eventName and returns custom handler.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  on(event: "refreshed", handler: typeof BaseSession.refreshed): void;
  on(event: "expired", handler: typeof BaseSession.expired): void;
  on(
    eventName: string,
    handler: typeof BaseSession.refreshed | typeof BaseSession.expired
  ) {
    this.emitter.on(eventName, handler);
    this.isSessionExpired(); // check if the session is expired immediately after adding the handler
  }

  /**
   * A handler that listens for an event once and returns a custom handler. Events listened to with this method cannot be removed with {@linkcode BasemapSession.off}.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  once(event: "refreshed", handler: typeof BaseSession.refreshed): void;
  once(event: "expired", handler: typeof BaseSession.expired): void;
  once(
    eventName: string,
    handler: typeof BaseSession.refreshed | typeof BaseSession.expired
  ) {
    const fn = (e: any) => {
      this.emitter.off(eventName, fn);
      handler(e);
    };

    this.emitter.on(eventName, fn);
  }

  /**
   * A handler that will remove a listener from a given event.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  off(event: "refreshed", handler: typeof BaseSession.refreshed): void;
  off(event: "expired", handler: typeof BaseSession.expired): void;
  off(
    eventName: string,
    handler: typeof BaseSession.refreshed | typeof BaseSession.expired
  ) {
    this.emitter.off(eventName, handler);
  }

  /**
   * These private methods are used to set the internal state of the session.
   */
  private setToken(token: string) {
    (this as Writable<typeof this>).token = token;
  }
  private setStartTime(startTime: Date) {
    (this as Writable<typeof this>).startTime = startTime;
  }
  private setEndTime(endTime: Date) {
    (this as Writable<typeof this>).endTime = endTime;
  }
  private setExpires(expires: Date) {
    (this as Writable<typeof this>).expires = expires;
  }
}
