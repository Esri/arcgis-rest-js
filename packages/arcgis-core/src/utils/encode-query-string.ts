import * as URLSearchParams from "url-search-params";
import { processParams } from "./process-params";

export function encodeQueryString(paramsObj: any): URLSearchParams {
  const params = new URLSearchParams();
  const newParams = processParams(paramsObj);
  Object.keys(newParams).forEach((key: any) => {
    params.set(key, newParams[key]);
  });
  return params;
}

export { URLSearchParams };
