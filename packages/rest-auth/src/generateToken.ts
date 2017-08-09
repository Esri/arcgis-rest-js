import { request, IParams } from "@esri/rest-request";

export interface IGenerateTokenParams extends IParams {
  username?: string;
  password?: string;
  expiration?: number;
  token?: string;
  serverUrl?: string;
}

export interface IGenerateTokenResponse {
  token: string;
  expires: number;
  ssl: boolean;
}

export function generateToken(
  url: string,
  params: IGenerateTokenParams
): Promise<IGenerateTokenResponse> {
  /* istanbul ignore else */
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.host
  ) {
    params.referer = window.location.host;
  } else {
    params.referer = "@esri.rest-auth";
  }

  return request(url, params);
}
