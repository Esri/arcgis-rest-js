/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { processParams, requiresFormData } from "./process-params";
import { encodeQueryString } from "./encode-query-string";
/**
 * Encodes parameters in a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object in browsers or in a [FormData](https://github.com/form-data/form-data) in Node.js
 *
 * @param params An object to be encoded.
 * @returns The complete [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object.
 */
export function encodeFormData(params: any): FormData | string {
  const useFormData = requiresFormData(params);
  const newParams = processParams(params);
  if (useFormData) {
    const formData = new FormData();
    Object.keys(newParams).forEach((key: any) => {
      formData.append(key, newParams[key]);
    });
    return formData;
  } else {
    return encodeQueryString(params);
  }
}
