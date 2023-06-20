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

export interface IGetAppInfoOptions extends IRequestOptions {
  authentication: ArcGISIdentityManager; // Must be named token as username is required
  itemId: string;
}

// raw response from registered App endpoint
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
  apnsProdCert: any; // type TBD
  apnsSandboxCert: any; // type TBD
  gcmApiKey: any; // type TBD
  isBeta: boolean;
}

// optimized interface represents app object (1. get rid of unwanted properties 2. timestamp -> date)
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
