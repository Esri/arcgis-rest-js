import { ITokenRequestOptions } from "./utils/ITokenRequestOptions.js";
export interface IFetchTokenResponse {
    token: string;
    expires: Date;
    username: string;
    ssl: boolean;
    refreshToken?: string;
    refreshTokenExpires?: Date;
}
export declare function fetchToken(url: string, requestOptions: ITokenRequestOptions): Promise<IFetchTokenResponse>;
