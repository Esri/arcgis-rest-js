/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { processParams } from "./process-params";

/**
 * Encodes parameters in a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object in browsers or in a [FormData](https://github.com/form-data/form-data) in Node.js
 *
 * @param params An object to be encoded.
 * @returns The complete [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object.
 */
export function encodeFormData(params: any): FormData {
  const formData = new FormData();
  const newParams = processParams(params);
  Object.keys(newParams).forEach((key: any) => {
    formData.append(key, newParams[key]);
  });
  return formData;
}
