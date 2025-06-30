import { IAuthenticationManager, request } from "@esri/arcgis-rest-request";
import { StyleFamily } from "../types/StyleFamily.js";

export interface IRequestNewSessionParams {
  startSessionUrl?: string;
  authentication: IAuthenticationManager | string;
  styleFamily?: StyleFamily;
  testSession?: boolean;
}

export interface IStartSessionResponse {
  sessionToken: string;
  endTime: number;
  startTime: number;
  styleFamily: StyleFamily;
}

export function startNewSession({
  startSessionUrl = "https://basemapstylesdev-api.arcgis.com/arcgis/rest/services/styles/v2/sessions/start",
  styleFamily = "arcgis",
  authentication,
  testSession = false
}: IRequestNewSessionParams): Promise<IStartSessionResponse> {
  return request(startSessionUrl, {
    httpMethod: "GET",
    authentication: authentication,
    params: { styleFamily, testSession }
  });
}
