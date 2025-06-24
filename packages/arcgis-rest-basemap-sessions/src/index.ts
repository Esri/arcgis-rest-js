import {
  ApiKeyManager,
  ApplicationCredentialsManager,
  ArcGISIdentityManager,
  IAuthenticationManager,
  request
} from "@esri/arcgis-rest-request";
import mitt from "mitt";

type StyleFamily = "open" | "arcgis";

type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};

const DEFAULT_START_BASEMAP_SESSION_URL =
  "https://basemapstylesdev-api.arcgis.com/arcgis/rest/services/styles/v2/sessions/start";

const DEFAULT_START_STATIC_BASEMAP_SESSION_URL =
  "https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/v1/sessions/start";

const DEFAULT_SAFETY_MARGIN = 1000 * 60 * 5; // Default to 5 minutes
const DEFAULT_CHECK_EXPIRATION_INTERVAL = 1000 * 10; // Default to 1 minute

interface IRequestNewSessionParams {
  startSessionUrl?: string;
  authentication: IAuthenticationManager | string;
  styleFamily?: StyleFamily;
  testSession?: boolean;
}

interface IBasemapSessionParams {
  token: string;
  startSessionUrl: string;
  styleFamily: StyleFamily;
  authentication: IAuthenticationManager | string;
  expires: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  safetyMargin?: number;
  testSession?: boolean;
}

interface IStartSessionParams {
  styleFamily?: StyleFamily;
  authentication: IAuthenticationManager | string;
  saftyMargin?: number;
  testSession?: boolean;
}

interface IStartSessionResponse {
  sessionToken: string;
  endTime: number;
  startTime: number;
  styleFamily: StyleFamily;
}

function startNewSession({
  startSessionUrl = "https://basemapstylesdev-api.arcgis.com/arcgis/rest/services/styles/v2/sessions/start",
  styleFamily = "arcgis",
  authentication,
  testSession = false
}: IRequestNewSessionParams): Promise<IStartSessionResponse> {
  return request(startSessionUrl, {
    httpMethod: "GET",
    authentication: authentication,
    params: { styleFamily, testSession }
  });
}

function deserializeAuthentication(
  authentication: any
): IAuthenticationManager | string {
  if (typeof authentication === "string") {
    return authentication as string;
  } else if (authentication.type === "ApiKeyManager") {
    return (ApiKeyManager as any).deserialize(JSON.stringify(authentication));
  } else if (authentication.type === "ApplicationCredentialsManager") {
    return (ApplicationCredentialsManager as any).deserialize(
      JSON.stringify(authentication)
    );
  } else if (authentication.type === "ArcGISIdentityManager") {
    return (ArcGISIdentityManager as any).deserialize(
      JSON.stringify(authentication)
    );
  }
  throw new Error("Unsupported authentication type");
}

/**
 * Handler for when a session is refreshed.
 *
 * @param params - The parameters for the refreshed event.
 * @param params.token - The session token.
 * @param params.startTime - The start time of the session.
 * @param params.endTime - The end time of the session.
 * @param params.expires - The expiration time of the session.
 * @event refreshed
 * @asMemberOf BaseSession
 * */
declare function refreshed(e: {
  expired: {
    token: string;
    startTime: Date;
    endTime: Date;
    expires: Date;
  };
}): void;

/**
 * Handler for when a session is expired.
 *
 * @param params - The parameters for the refreshed event.
 * @param params.token - The session token that has expired.
 * @param params.startTime - The start time of the token that expired.
 * @param params.endTime - The end time of the that expired.
 * @param params.expires - The expiration time of the that expired.
 * @event refreshed
 * @asMemberOf BaseSession
 * */
declare function expired(params: {
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
}): void;

abstract class BaseSession implements IAuthenticationManager {
  readonly portal: string;
  readonly styleFamily: StyleFamily;
  readonly authentication: IAuthenticationManager | string;
  readonly expires: Date;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly token: string;
  readonly startSessionUrl: string;
  readonly saftyMargin: number;
  readonly testSession: boolean;
  private expirationTimerId: any = null;

  /**
   * Internal instance of [`mitt`](https://github.com/developit/mitt) used for event handlers. It is recommended to use {@linkcode BasemapSession.on}, {@linkcode BasemapSession.off} or {@linkcode BasemapSession.once} instead of `emitter.`
   */
  private emitter: any;

  constructor(params: IBasemapSessionParams) {
    this.startSessionUrl = params.startSessionUrl;
    this.token = params.token;
    this.styleFamily = params.styleFamily || "arcgis";
    this.authentication = params.authentication;
    this.testSession = params.testSession || false;
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

  stopCheckingExpirationTime() {
    if (this.expirationTimerId) {
      clearInterval(this.expirationTimerId);
      this.expirationTimerId = null;
    }
  }

  protected static async startSession<T extends BaseSession>(
    {
      startSessionUrl,
      styleFamily = "arcgis",
      authentication,
      safetyMargin = DEFAULT_SAFETY_MARGIN,
      testSession = false
    }: {
      startSessionUrl?: string;
      styleFamily?: StyleFamily;
      authentication: IAuthenticationManager | string;
      safetyMargin?: number;
      testSession?: boolean;
    },
    SessionClass: new (params: IBasemapSessionParams) => T
  ): Promise<T> {
    const sessionResponse = await startNewSession({
      startSessionUrl,
      styleFamily,
      authentication,
      testSession
    });

    const timeToSubtract = testSession
      ? 1
      : safetyMargin || DEFAULT_SAFETY_MARGIN;

    const session = new SessionClass({
      startSessionUrl: startSessionUrl,
      token: sessionResponse.sessionToken,
      styleFamily,
      authentication,
      safetyMargin: timeToSubtract,
      expires: new Date(sessionResponse.endTime - timeToSubtract),
      startTime: new Date(sessionResponse.startTime),
      endTime: new Date(sessionResponse.endTime),
      testSession
    });

    return session as T;
  }

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
      testSession: this.testSession
    };
  }

  serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  protected static deserializeSession<T extends BaseSession>(
    serializedBasemapSession: string,
    SessionClass: new (params: IBasemapSessionParams) => T
  ) {
    const params: IBasemapSessionParams = JSON.parse(serializedBasemapSession);
    const authentication = deserializeAuthentication(params.authentication);

    const timeToSubtract = params.testSession
      ? 1
      : params.safetyMargin || DEFAULT_SAFETY_MARGIN;

    const session = new SessionClass({
      startSessionUrl: params.startSessionUrl,
      token: params.token,
      styleFamily: params.styleFamily,
      authentication,
      expires: params.expires,
      safetyMargin: timeToSubtract,
      startTime: new Date(params.startTime),
      endTime: new Date(params.endTime),
      testSession: params.testSession || false
    });

    return session;
  }

  get isExpired(): boolean {
    return this.expires < new Date();
  }

  getToken(): Promise<string> {
    if (this.isExpired) {
      console.log(
        "BasmapStyleSession.getToken(): Session expired, refreshing credentials..."
      );
      return this.refreshCredentials().then(() => this.token);
    }

    return Promise.resolve(this.token);
  }

  get canRefresh(): boolean {
    return true;
  }

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
      testSession: this.testSession
    });

    this.asWriteable.token = newSession.sessionToken;
    this.asWriteable.startTime = new Date(newSession.startTime);
    this.asWriteable.endTime = new Date(newSession.endTime);
    this.asWriteable.expires = new Date(newSession.endTime - this.saftyMargin);

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
  on(event: "refreshed", handler: typeof refreshed): void;
  on(event: "expired", handler: typeof expired): void;
  on(eventName: string, handler: typeof refreshed | typeof expired) {
    this.emitter.on(eventName, handler);
    this.isSessionExpired(); // check if the session is expired immediately after adding the handler
  }

  /**
   * A handler that listens for an event once and returns a custom handler. Events listened to with this method cannot be removed with {@linkcode BasemapSession.off}.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  once(event: "refreshed", handler: typeof refreshed): void;
  once(event: "expired", handler: typeof expired): void;
  once(eventName: string, handler: typeof refreshed | typeof expired) {
    const fn = (e: any) => {
      this.emitter.off(eventName, fn);
      handler(e);
    };

    this.emitter.on(eventName, fn);
  }

  /**
   * A handler that will remove a listener after its emitted and returns a custom handler.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  off(eventName: string, handler: () => void) {
    this.emitter.off(eventName, handler);
  }

  // use this.asWriteable.* to write to readonly fields
  private get asWriteable(): Writable<this> {
    return this as Writable<this>;
  }
}

class BasemapStyleSession extends BaseSession {
  constructor(params: IBasemapSessionParams) {
    super(params);
  }

  static async start(params: IStartSessionParams) {
    return BaseSession.startSession<BasemapStyleSession>(
      {
        ...params,
        startSessionUrl: DEFAULT_START_BASEMAP_SESSION_URL
      },
      BasemapStyleSession as new (
        params: IBasemapSessionParams
      ) => BasemapStyleSession
    );
  }

  static deserialize(serializedBasemapSession: string) {
    return BaseSession.deserializeSession<BasemapStyleSession>(
      serializedBasemapSession,
      BasemapStyleSession as new (
        params: IBasemapSessionParams
      ) => BasemapStyleSession
    );
  }
}

class StaticBasemapTilesSession extends BaseSession {
  constructor(params: IBasemapSessionParams) {
    super(params);
  }

  static async start(
    params: IStartSessionParams
  ): Promise<StaticBasemapTilesSession> {
    return BaseSession.startSession(
      {
        ...params,
        startSessionUrl: DEFAULT_START_BASEMAP_SESSION_URL
      },
      StaticBasemapTilesSession as new (
        params: IBasemapSessionParams
      ) => StaticBasemapTilesSession
    );
  }

  static deserialize(
    serializedBasemapSession: string
  ): StaticBasemapTilesSession {
    return BaseSession.deserializeSession<StaticBasemapTilesSession>(
      serializedBasemapSession,
      StaticBasemapTilesSession
    );
  }
}

export {
  StaticBasemapTilesSession,
  BasemapStyleSession,
  IStartSessionParams,
  IBasemapSessionParams,
  StyleFamily
};

export type { IAuthenticationManager } from "@esri/arcgis-rest-request";
