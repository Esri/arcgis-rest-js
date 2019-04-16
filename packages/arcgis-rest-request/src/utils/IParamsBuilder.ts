import { IParams } from "./IParams";

export interface IParamsBuilder {
  toParams(additionalParams?: IParams): IParams;
}
