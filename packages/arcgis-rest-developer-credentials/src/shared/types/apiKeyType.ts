import {
  ArcGISIdentityManager,
  IRequestOptions
} from "@esri/arcgis-rest-request";
import { IRegisterAppOptions, IRegisteredAppResponse } from "./appType.js";
import { Privileges } from "../enum/PRIVILEGE.js";
import { IItem, IItemAdd } from "@esri/arcgis-rest-portal";

export interface ICreateApiKeyOptions
  extends Omit<IRegisterAppOptions, "itemId" | "redirect_uris" | "appType">,
    Omit<IItemAdd, "type"> {}

/**
 * Represents only the API key related properties from a registered app info object
 */
export interface IApiKeyInfo
  extends Omit<
    IRegisteredAppResponse,
    | "client_id"
    | "client_secret"
    | "redirect_uris"
    | "appType"
    | "registered"
    | "modified"
  > {
  apiKey: string;
  registered: Date;
  modified: Date;
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
