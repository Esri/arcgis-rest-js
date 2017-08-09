import { request, IParams } from "@esri/rest-request";
import { isBrowser } from "./utils";

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
  return request(url, {
    ...{
      referer: isBrowser()
        ? window.location
            .host /* istanbul ignore next since coverage is browser only mocking `window` is hard. */
        : "@esri/rest-auth"
    },
    ...params
  });
}
