import { HTTPMethods } from "./HTTPMethods.js";
import { IGenerateTokenParams } from "./IGenerateTokenParams.js";
import { IFetchTokenParams } from "./IFetchTokenParams.js";
export interface ITokenRequestOptions {
    params?: IGenerateTokenParams | IFetchTokenParams;
    httpMethod?: HTTPMethods;
    fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}
