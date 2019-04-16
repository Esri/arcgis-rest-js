import { IParams } from "./params";

export interface IParamsBuilder {
  toParams(additionalParams?: IParams): IParams;
}
