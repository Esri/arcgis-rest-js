import { IParams } from "./IParams.js";
export interface IParamsBuilder {
    toParams(additionalParams?: IParams): IParams;
}
