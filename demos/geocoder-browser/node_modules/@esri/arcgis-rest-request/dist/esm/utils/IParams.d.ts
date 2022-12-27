import { ResponseFormats } from "./ResponseFormats.js";
export interface IParams {
    f?: ResponseFormats;
    [key: string]: any;
}
