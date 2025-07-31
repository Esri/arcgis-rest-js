import {
  BaseSession,
  IBasemapSessionParams,
  IStartSessionParams
} from "./BaseSession.js";
import { DEFAULT_START_BASEMAP_STYLE_SESSION_URL } from "./utils/defaults.js";

/**
 * `BasemapStyleSession` is a class that extends {@linkcode BaseSession} to manage sessions
 * for basemap styles. It provides methods to {@linkcode BasemapStyleSession.start} a new session
 * which should be used instead of constructing a new instance directly.
 *
 * @class BasemapStyleSession
 * @extends BaseSession
 */
export class BasemapStyleSession extends BaseSession {
  /**
   * Creates an instance of `BasemapStyleSession`. Constructing `BasemapStyleSession` directly is discouraged.
   * Instead, use the static method {@linkcode BasemapStyleSession.start} to start a new session.
   */
  constructor(params: IBasemapSessionParams) {
    super(params);
  }

  /**
   * Starts a new basemap style session.
   */
  static async start(params: IStartSessionParams) {
    return BaseSession.startSession<BasemapStyleSession>(
      {
        ...params,
        startSessionUrl:
          params?.startSessionUrl || DEFAULT_START_BASEMAP_STYLE_SESSION_URL
      },
      BasemapStyleSession as new (
        params: IBasemapSessionParams
      ) => BasemapStyleSession
    );
  }
}
