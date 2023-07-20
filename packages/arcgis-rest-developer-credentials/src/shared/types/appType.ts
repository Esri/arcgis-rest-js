import {
  IRequestOptions,
  ArcGISIdentityManager
} from "@esri/arcgis-rest-request";
import { UnixTime } from "@esri/arcgis-rest-portal";
import { Privileges } from "../enum/PRIVILEGE.js";

/**
 * Accepted app types.
 */
export type AppType = "apikey" | "browser" | "native" | "server" | "multiple";

/**
 * Options to register an app.
 */
export interface IRegisterAppOptions extends Omit<IRequestOptions, "params"> {
  /**
   * itemId that the newly registered app will be based on.
   */
  itemId: string;
  /**
   * App types. For more info, refer to {@linkcode AppType}.
   */
  appType: AppType;
  /**
   * Redirect URIs set for this app.
   */
  redirect_uris: string[];
  /**
   * Http Referrers set for this app.
   */
  httpReferrers: string[];
  /**
   * Privilege lists. For more info, refer to {@linkcode Privileges}.
   */
  privileges: Array<Privileges | `${Privileges}`>;
  /**
   * {@linkcode ArcGISIdentityManager} authentication.
   */
  authentication: ArcGISIdentityManager;
}

/**
 * Options to retrieve an app.
 */
export interface IGetAppInfoOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode ArcGISIdentityManager} authentication.
   */
  authentication: ArcGISIdentityManager;
  /**
   * itemId of which app to be retrieved.
   */
  itemId: string;
}

/**
 * Raw response of app related endpoints calls.
 */
export interface IRegisteredAppResponse {
  itemId: string;
  /**
   * Only to be present if appType is apikey
   */
  apiKey?: string;
  appType: AppType;
  client_id: string;
  client_secret: string;
  httpReferrers: string[];
  redirect_uris: string[];
  privileges: Array<Privileges | `${Privileges}`>;
  registered: UnixTime;
  modified: UnixTime;
  apnsProdCert: any;
  apnsSandboxCert: any;
  gcmApiKey: any;
  isBeta: boolean;
}

/**
 * Return value of {@linkcode registerApp} and {@linkcode getRegisteredAppInfo} representing an app entity.
 */
export interface IApp
  extends Omit<
    IRegisteredAppResponse,
    | "registered"
    | "modified"
    | "apnsProdCert"
    | "apnsSandboxCert"
    | "gcmApiKey"
    | "isBeta"
  > {
  registered: Date;
  modified: Date;
}

/**
 * Options to unregister an app.
 */
export interface IUnregisterAppOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode ArcGISIdentityManager} authentication.
   */
  authentication: ArcGISIdentityManager;
  /**
   * itemId of which app to be unregistered.
   */
  itemId: string;
}

/**
 * Response of app un-registration.
 */
export interface IUnregisterAppResponse {
  success: true | false;
  /**
   * itemId of which app has been unregistered.
   */
  itemId: string;
}
