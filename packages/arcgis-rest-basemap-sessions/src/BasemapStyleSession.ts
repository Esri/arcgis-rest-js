import {
  BaseSession,
  IBasemapSessionParams,
  IStartSessionParams
} from "./BaseSession.js";
import { DEFAULT_START_BASEMAP_SESSION_URL } from "./utils/defaults.js";

/**
 * `BasemapStyleSession` is a class that extends {@linkcode BaseSession} to manage sessions
 * for basemap styles. It provides methods to {@linkcode BasemapStyleSession.start} a new session and {@linkcode BasemapStyleSession.deserialize} an existing session.
 *
 * @class BasemapStyleSession
 * @extends BaseSession
 */
export class BasemapStyleSession extends BaseSession {
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
        startSessionUrl: DEFAULT_START_BASEMAP_SESSION_URL
      },
      BasemapStyleSession as new (
        params: IBasemapSessionParams
      ) => BasemapStyleSession
    );
  }
}
