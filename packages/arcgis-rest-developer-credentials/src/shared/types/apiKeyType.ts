import {
  IAuthenticationManager,
  IRequestOptions,
  ISpatialReference
} from "@esri/arcgis-rest-request";
import { IRegisterAppOptions, IApp } from "./appType.js";
import { Privileges } from "../enum/privileges.js";
import { IItem } from "@esri/arcgis-rest-portal";

/**
 * Options to register an API Key.
 */
export interface ICreateApiKeyOptions
  extends Omit<
    IRegisterAppOptions,
    "itemId" | "redirect_uris" | "appType" | "httpReferrers"
  > {
  httpReferrers?: string[];
  title: string;
  owner?: string;
  typeKeywords?: string[];
  description?: string;
  snippet?: string;
  documentation?: string;
  extent?: number[][];
  categories?: string[];
  spatialReference?: ISpatialReference;
  culture?: string;
  properties?: any;
  url?: string;
  tags?: string[];
}

/**
 * Options to retrieve an API Key.
 */
export interface IGetApiKeyOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
  /**
   * itemId of which API key to be retrieved.
   */
  itemId: string;
}

/**
 * Represent only the API key related properties from {@linkcode IApp}.
 */
export interface IApiKeyInfo
  extends Omit<
    IApp,
    "client_id" | "client_secret" | "redirect_uris" | "appType"
  > {
  apiKey: string;
}

/**
 * Return value of {@linkcode createApiKey}, {@linkcode getApiKey}, {@linkcode updateApiKey} representing an API Key entity.
 */
export interface IApiKeyResponse extends IApiKeyInfo {
  /**
   * Represent item info attached to this API Key.
   */
  item: IItem;
}

/**
 * Options to update an API Key.
 */
export interface IUpdateApiKeyOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
  /**
   * itemId of which API key will be updated.
   */
  itemId: string;
  /**
   * Override previous `httpReferrers` if this value is provided.
   */
  httpReferrers?: string[];
  /**
   * Override previous `privileges` if this value is provided.
   */
  privileges?: Array<Privileges | `${Privileges}`>;
}

/**
 * Options to delete an API key.
 */
export interface IDeleteApiKeyOption extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
  /**
   * itemId of which API key to be removed.
   */
  itemId: string;
}

/**
 * Response of API key deletion.
 */
export interface IDeleteApiKeyResponse {
  /**
   * itemId of which API key has been removed.
   */
  itemId: string;
  success: boolean;
}
