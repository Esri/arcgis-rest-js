/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { processParams, requiresFormData } from "./process-params.js";
import { encodeQueryString } from "./encode-query-string.js";
import { FormData } from "@esri/arcgis-rest-form-data";
/**
 * Encodes parameters in a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object in browsers or in a [FormData](https://github.com/form-data/form-data) in Node.js
 *
 * @param params An object to be encoded.
 * @returns The complete [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object.
 */
export function encodeFormData(params, forceFormData) {
    // see https://github.com/Esri/arcgis-rest-js/issues/499 for more info.
    const useFormData = requiresFormData(params) || forceFormData;
    const newParams = processParams(params);
    if (useFormData) {
        const formData = new FormData();
        Object.keys(newParams).forEach((key) => {
            if (typeof Blob !== "undefined" && newParams[key] instanceof Blob) {
                /* To name the Blob:
                 1. look to an alternate request parameter called 'fileName'
                 2. see if 'name' has been tacked onto the Blob manually
                 3. if all else fails, use the request parameter
                */
                const filename = newParams["fileName"] || newParams[key].name || key;
                formData.append(key, newParams[key], filename);
            }
            else {
                formData.append(key, newParams[key]);
            }
        });
        return formData;
    }
    else {
        return encodeQueryString(params);
    }
}
//# sourceMappingURL=encode-form-data.js.map