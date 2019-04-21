import { ResponseFormats } from "./ResponseFormats";

export interface IParams {
  f?: ResponseFormats;
  [key: string]: any;
}
