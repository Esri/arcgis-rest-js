import {
  BaseSession,
  IBasemapSessionParams,
  IStartSessionParams
} from "./BaseSession.js";
import { DEFAULT_START_STATIC_BASEMAP_SESSION_URL } from "./utils/defaults.js";

/**
 * `StaticBasemapTilesSession` is a class that extends {@linkcode BaseSession} to manage sessions
 * for static basemap tiles. It provides methods to {@linkcode StaticBasemapTilesSession.start} a new session
 * which should be used instead of constructing a new instance directly.
 *
 * @class StaticBasemapTilesSession
 * @extends BaseSession
 */
export class StaticBasemapTilesSession extends BaseSession {
  /**
   * Creates an instance of `StaticBasemapTilesSession`. Constructing `StaticBasemapTilesSession` directly is discouraged.
   * Instead, use the static method {@linkcode StaticBasemapTilesSession.start} to start a new session.`
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
        startSessionUrl:
          params?.startSessionUrl || DEFAULT_START_STATIC_BASEMAP_SESSION_URL
      },
      StaticBasemapTilesSession as new (
        params: IBasemapSessionParams
      ) => StaticBasemapTilesSession
    );
  }
}
