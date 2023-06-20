import {
  ArcGISIdentityManager,
  IRequestOptions
} from "@esri/arcgis-rest-request";
import { IRegisterAppOptions, IApp } from "./appType.js";
import { Privileges } from "../enum/PRIVILEGE.js";
import { IItem, IItemAdd } from "@esri/arcgis-rest-portal";

export interface ICreateApiKeyOptions
  extends Omit<
      IRegisterAppOptions,
      "itemId" | "redirect_uris" | "appType" | "httpReferrers"
    >,
    Omit<IItemAdd, "type"> {
  httpReferrers?: string[];
}

export interface IGetApiKeyOptions extends IRequestOptions {
  authentication: ArcGISIdentityManager; // Must be named token as username is required
  itemId: string;
}

/**
 * Represents only the API key related properties from a registered app info object
 */
export interface IApiKeyInfo
  extends Omit<
    IApp,
    "client_id" | "client_secret" | "redirect_uris" | "appType"
  > {
  apiKey: string;
}

export interface IApiKeyResponse extends IApiKeyInfo {
  item: IItem;
}

export interface IUpdateApiKeyOptions extends IRequestOptions {
  authentication: ArcGISIdentityManager;
  itemId: string;
  httpReferrers?: string[];
  privileges?: Array<keyof typeof Privileges>;
}
