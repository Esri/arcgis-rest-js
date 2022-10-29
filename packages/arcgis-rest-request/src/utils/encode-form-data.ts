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
export function encodeFormData(
  params: any,
  forceFormData?: boolean
): FormData | string {
  // see https://github.com/Esri/arcgis-rest-js/issues/499 for more info.
  const useFormData = requiresFormData(params) || forceFormData;
  const newParams = processParams(params);
  if (useFormData) {
    const formData = new FormData();
    Object.keys(newParams).forEach((key: any) => {
      if (typeof Blob !== "undefined" && newParams[key] instanceof Blob) {
        /* To name the Blob:
         1. look to an alternate request parameter called 'fileName'
         2. see if 'name' has been tacked onto the Blob manually
         3. if all else fails, use the request parameter
        */
        const filename = newParams["fileName"] || newParams[key].name || key;
        formData.append(key, newParams[key], filename);
      } else if (
        newParams[key].constructor &&
        newParams[key].constructor.name === 'ReadStream' && 
        // TODO: only specify the knownLength option if a valid value is given.
        // If we can verify in all REST API that the option is need for
        // node ReadStream, it can throw an error for the missing dataSize value.
        // Note that such change will be a breaking change.
        Number.isInteger(newParams["dataSize"])
      ) {
        // have to cast the formData to any so that I can use the unofficial API
        // in the form-data library to handle Node ReadStream. See
        // https://github.com/form-data/form-data/issues/508
        (formData as any).append(key, newParams[key], {
          knownLength: newParams["dataSize"]
        });
      } else {
        formData.append(key, newParams[key]);
      }
    });
    return formData;
  } else {
    return encodeQueryString(params);
  }
}