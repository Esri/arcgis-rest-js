import {
  ArcGISIdentityManager,
  IRequestOptions
} from "@esri/arcgis-rest-request";
import { IRegisterAppOptions, IRegisteredAppResponse } from "./appType.js";
import { Privileges } from "../enum/PRIVILEGE.js";

export interface ICreateApiKeyOptions
  extends Omit<IRegisterAppOptions, "itemId" | "redirect_uris" | "appType"> {
  title: string;
  description: string;
}

export interface IApiKeyResponse
  extends Omit<
    IRegisteredAppResponse,
    "client_id" | "client_secret" | "redirect_uris" | "appType" | "registered"
  > {
  apiKey: string;
}

export interface IUpdateApiKeyOptions extends IRequestOptions {
  authentication: ArcGISIdentityManager;
  apiKey: IApiKeyResponse;
  updatedField: {
    httpReferrers?: string[];
    privileges?: Array<keyof typeof Privileges>;
  };
}
