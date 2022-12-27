import { IParams } from "./IParams.js";
export interface IGenerateTokenParams extends IParams {
    username?: string;
    password?: string;
    expiration?: number;
    token?: string;
    serverUrl?: string;
}
