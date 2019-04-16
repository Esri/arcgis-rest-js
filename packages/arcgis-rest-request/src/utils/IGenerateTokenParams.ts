import { IParams } from "./IParams";

export interface IGenerateTokenParams extends IParams {
  username?: string;
  password?: string;
  expiration?: number;
  token?: string;
  serverUrl?: string;
}
