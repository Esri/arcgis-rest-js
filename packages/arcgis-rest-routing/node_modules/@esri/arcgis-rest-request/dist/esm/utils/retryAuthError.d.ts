import { IRequestOptions } from "./IRequestOptions.js";
import { IAuthenticationManager } from "./IAuthenticationManager.js";
export declare type IRetryAuthError = (url: string, options: IRequestOptions) => Promise<IAuthenticationManager>;
