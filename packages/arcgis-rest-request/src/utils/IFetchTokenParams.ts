import { GrantTypes } from "./GrantTypes";
import { IParams } from "./IParams";

export interface IFetchTokenParams extends IParams {
  client_id: string;
  client_secret?: string;
  grant_type: GrantTypes;
  redirect_uri?: string;
  refresh_token?: string;
  code?: string;
}
