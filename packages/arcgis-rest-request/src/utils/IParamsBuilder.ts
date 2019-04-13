import { IParams } from "./params";

export interface IParamsBuilder {
  toParams(additionalParmas?: IParams): IParams;
}
