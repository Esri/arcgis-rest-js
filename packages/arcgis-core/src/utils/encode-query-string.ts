import * as URLSearchParams from "url-search-params";
import { processParams } from "./process-params";

/**
 * Encodes parameters in a [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object in browsers or in a [URLSearchParams](https://github.com/WebReflection/url-search-params) in Node.js
 *
 * @param params An object to be encoded.
 * @returns The complete [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object.
 */
export function encodeQueryString(params: any): URLSearchParams {
  const qa = new URLSearchParams();
  const newParams = processParams(params);
  Object.keys(newParams).forEach((key: any) => {
    qa.set(key, newParams[key]);
  });
  return qa;
}

export { URLSearchParams };
