import {
  IRequestOptions,
  ArcGISIdentityManager
} from "@esri/arcgis-rest-request";
import { UnixTime } from "@esri/arcgis-rest-portal";
import { Privileges } from "../enum/PRIVILEGE.js";

export type AppType = "apikey" | "browser" | "native" | "server" | "multiple";

export interface IRegisterAppOptions extends IRequestOptions {
  itemId: string;
  appType: AppType;
  redirect_uris: string[];
  httpReferrers: string[];
  privileges: Array<keyof typeof Privileges>;
  authentication: ArcGISIdentityManager;
}

/* TODO: - /sharing/rest/oauth2/apps/appId/update documentation is unclear.
 *       - At app level, is this endpoint capable to update more field other than "privileges" and "httpReferrers"?
 *       - e.g. "redirect_uris"...
 */
export interface IUpdateAppOptions extends IRequestOptions {
  authentication: ArcGISIdentityManager;
  app: IRegisteredAppResponse;
  updatedField: {
    httpReferrers?: string[];
    privileges?: Array<keyof typeof Privileges>;
  };
}

export interface IGetAppInfoOptions extends IRequestOptions {
  authentication: ArcGISIdentityManager; // Must be named token as username is required
  itemId: string;
}

export interface IRegisteredAppResponse {
  itemId: string;
  apiKey?: string; // Only if appType is apikey
  appType: AppType;
  client_id: string;
  client_secret: string;
  httpReferrers: string[];
  redirect_uris: string[];
  privileges: Array<keyof typeof Privileges>;
  registered: UnixTime;
  modified: UnixTime;
}
