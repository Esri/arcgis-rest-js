import { IAuthenticationManager, request } from "@esri/arcgis-rest-request";
import { StyleFamily } from "../types/StyleFamily.js";
import { DEFAULT_DURATION } from "./defaults.js";

export interface IRequestNewSessionParams {
  startSessionUrl: string;
  authentication: IAuthenticationManager | string;
  styleFamily?: StyleFamily;
  duration?: number;
}

export interface IStartSessionResponse {
  sessionToken: string;
  endTime: number;
  startTime: number;
  styleFamily: StyleFamily;
}

export function startNewSession({
  startSessionUrl,
  authentication,
  styleFamily = "arcgis",
  duration = DEFAULT_DURATION
}: IRequestNewSessionParams): Promise<IStartSessionResponse> {
  return request(startSessionUrl, {
    httpMethod: "GET",
    authentication: authentication,
    params: { styleFamily, durationSeconds: duration }
  });
}
