/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
* Apache-2.0 */

/**
 * HTTP methods used by the ArcGIS REST API.
 */
export type HTTPMethods = "GET" | "POST";

/**
 * Valid response formats for the `f` parameter.
 */
export type ResponseFormats =
  | "json"
  | "geojson"
  | "text"
  | "html"
  | "image"
  | "zip";

export type GrantTypes =
  | "authorization_code"
  | "refresh_token"
  | "client_credentials"
  | "exchange_refresh_token";

export interface IParams {
  f?: ResponseFormats;
  [key: string]: any;
}

export interface IGenerateTokenParams extends IParams {
  username?: string;
  password?: string;
  expiration?: number;
  token?: string;
  serverUrl?: string;
}

export interface IFetchTokenParams extends IParams {
  client_id: string;
  client_secret?: string;
  grant_type: GrantTypes;
  redirect_uri?: string;
  refresh_token?: string;
  code?: string;
}

export interface ITokenRequestOptions {
  params?: IGenerateTokenParams | IFetchTokenParams;
  httpMethod?: HTTPMethods;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

export interface IHeaders {
  [key: string]: any;
}
