import { HTTPMethods } from "./HTTPMethods";
import { IGenerateTokenParams } from "./IGenerateTokenParams";
import { IFetchTokenParams } from "./IFetchTokenParams";

export interface ITokenRequestOptions {
  params?: IGenerateTokenParams | IFetchTokenParams;
  httpMethod?: HTTPMethods;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}
