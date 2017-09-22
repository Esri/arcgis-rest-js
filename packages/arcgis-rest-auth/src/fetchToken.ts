import { request, IParams } from "@esri/arcgis-rest-request";

export type GrantTypes =
  | "authorization_code"
  | "refresh_token"
  | "client_credentials"
  | "exchange_refresh_token";

export interface IFetchTokenParams extends IParams {
  client_id: string;
  client_secret?: string;
  grant_type: GrantTypes;
  redirect_uri?: string;
  refresh_token?: string;
  code?: string;
}

interface IFetchTokenRawResponse {
  access_token: string;
  expires_in: number;
  username: string;
  refresh_token?: string;
}

export interface IFetchTokenResponse {
  token: string;
  expires: Date;
  username: string;
  refreshToken?: string;
}

export function fetchToken(
  url: string,
  params: IFetchTokenParams
): Promise<IFetchTokenResponse> {
  return request(url, params).then((response: IFetchTokenRawResponse) => {
    const r: IFetchTokenResponse = {
      token: response.access_token,
      username: response.username,
      expires: new Date(
        Date.now() + (response.expires_in * 60 * 1000 - 60 * 1000)
      )
    };
    if (response.refresh_token) {
      r.refreshToken = response.refresh_token;
    }

    return r;
  });
}
