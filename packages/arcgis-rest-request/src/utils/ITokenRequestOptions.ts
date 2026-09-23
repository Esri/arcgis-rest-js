import { IRequestOptions } from "./IRequestOptions.js";
import { IGenerateTokenParams } from "./IGenerateTokenParams.js";
import { IFetchTokenParams } from "./IFetchTokenParams.js";

export interface ITokenRequestOptions extends IRequestOptions {
  params?: IGenerateTokenParams | IFetchTokenParams;
}
