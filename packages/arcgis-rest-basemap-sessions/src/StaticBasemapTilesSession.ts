import {
  BaseSession,
  IBasemapSessionParams,
  IStartSessionParams
} from "./BaseSession.js";
import { DEFAULT_START_STATIC_BASEMAP_SESSION_URL } from "./utils/defaults.js";

/**
 * `StaticBasemapTilesSession` is a class that extends {@linkcode BaseSession} to manage sessions
 * for static basemap tiles. It provides methods to {@linkcode StaticBasemapTilesSession.start} a new session and {@linkcode StaticBasemapTilesSession.deserialize} an existing session.
 *
 * @class StaticBasemapTilesSession
 * @extends BaseSession
 */
export class StaticBasemapTilesSession extends BaseSession {
  /**
   * Creates an instance of `StaticBasemapTilesSession`. You typically should not call this constructor directly; instead, use the static methods to create or deserialize a session.
   * You may need to call this if you are implmenting custom logic for storing or managing sessions.
   */
  constructor(params: IBasemapSessionParams) {
    super(params);
  }

  /**
   * Starts a new static basemap tiles session.
   */
  static async start(
    params: IStartSessionParams
  ): Promise<StaticBasemapTilesSession> {
    return BaseSession.startSession(
      {
        ...params,
        startSessionUrl: DEFAULT_START_STATIC_BASEMAP_SESSION_URL
      },
      StaticBasemapTilesSession as new (
        params: IBasemapSessionParams
      ) => StaticBasemapTilesSession
    );
  }

  /**
   * Deserializes a static basemap tiles session from a serialized string.
   * You can serialize a session using the {@linkcode StaticBasemapTilesSession.serialize}.
   */
  static deserialize(
    serializedBasemapSession: string
  ): StaticBasemapTilesSession {
    return BaseSession.deserializeSession<StaticBasemapTilesSession>(
      serializedBasemapSession,
      StaticBasemapTilesSession
    );
  }
}
