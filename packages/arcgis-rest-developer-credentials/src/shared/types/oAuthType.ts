import { IItem } from "@esri/arcgis-rest-portal";
import {
  IAuthenticationManager,
  IRequestOptions,
  ISpatialReference
} from "@esri/arcgis-rest-request";

/**
 * Options to register an OAuth2.0 app.
 */
export interface ICreateOAuthAppOption extends Omit<IRequestOptions, "params"> {
  /**
   * Redirect URIs set for this OAuth2.0 app.
   */
  redirect_uris?: string[];
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
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
 * Options to retrieve an OAuth2.0 app.
 */
export interface IGetOAuthAppOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
  /**
   * itemId of which OAuth2.0 app to be retrieved.
   */
  itemId: string;
}

/**
 * Options to update an OAuth2.0 app.
 */
export interface IUpdateOAuthOptions extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
  /**
   * itemId of which OAuth2.0 app to be updated.
   */
  itemId: string;
  /**
   * Override previous `redirect_uris` if this value is provided.
   */
  redirect_uris?: string[];
}

/**
 * Represent only the OAuth2.0 app related properties from {@linkcode IApp}.
 */
export interface IOAuthAppInfo {
  itemId: string;
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  registered: Date;
  modified: Date;
}

/**
 * Return value of {@linkcode createOAuthApp}, {@linkcode getOAuthApp}, {@linkcode updateOAuthApp} representing an OAuth2.0 app entity.
 */
export interface IOAuthApp extends IOAuthAppInfo {
  /**
   * Represent item info attached to this OAuth2.0 app.
   */
  item: IItem;
}

/**
 * Options to delete an OAuth2.0 app.
 */
export interface IDeleteOAuthAppOption extends Omit<IRequestOptions, "params"> {
  /**
   * {@linkcode @esri/arcgis-rest-request!IAuthenticationManager} authentication.
   */
  authentication: IAuthenticationManager;
  /**
   * itemId of which OAuth2.0 app to be removed.
   */
  itemId: string;
}

/**
 * Response of OAuth2.0 app deletion.
 */
export interface IDeleteOAuthAppResponse {
  /**
   * itemId of which OAuth2.0 app has been removed.
   */
  itemId: string;
  success: boolean;
}
