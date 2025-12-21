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
  /**
   * Expiration date of the access token in slot 1 of this API Key.
   */
  apiToken1ExpirationDate?: Date;
  /**
   * Expiration date of the access token in slot 2 of this API Key.
   */
  apiToken2ExpirationDate?: Date;
  /**
   * Generate a new access token in slot 1 of this API. Will override and invalidate any existing token.
   */
  generateToken1?: boolean;
  /**
   * Generate a new access token in slot 2 of this API. Will override and invalidate any existing token.
   */
  generateToken2?: boolean;
}

/**
 * Options to retrieve an API Key.
 */
export interface IGetApiKeyOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
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
  extends Omit<IApp, "client_secret" | "redirect_uris" | "appType"> {}

/**
 * Return value of {@linkcode createApiKey}, {@linkcode getApiKey}, {@linkcode updateApiKey} representing an API Key entity. `accessToken1`/`accessToken2` properties are only available when `generateToken1`/`generateToken2` are `true`.
 */
export interface IApiKeyResponse extends IApiKeyInfo {
  /**
   * Represent item info attached to this API Key.
   */
  item: IItem;
  accessToken1?: null | string;
  accessToken2?: null | string;
}

/**
 * Options to update an API Key.
 */
export interface IUpdateApiKeyOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
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
  privileges?: string[];
  /**
   * Expiration date of the access token in slot 1 of this API Key.
   */
  apiToken1ExpirationDate?: Date;
  /**
   * Expiration date of the access token in slot 2 of this API Key.
   */
  apiToken2ExpirationDate?: Date;
  /**
   * Generate a new access token in slot 1 of this API. Will override and invalidate any existing token.
   */
  generateToken1?: boolean;
  /**
   * Generate a new access token in slot 2 of this API. Will override and invalidate any existing token.
   */
  generateToken2?: boolean;
}

/**
 * Options to delete an API key.
 */
export interface IDeleteApiKeyOption extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
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

export interface IInvalidateApiKeyOptions
  extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
  /**
   * itemId of the item of the API key to be revoked.
   */
  itemId: string;
  /**
   * The API key to be revoked. The full or partial API key or the slot number (1 or 2) can be provided.
   */
  apiKey?: string | 1 | 2;
}

export interface IInvalidateApiKeyResponse {
  success: boolean;
}
