"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeFormData = void 0;
const process_params_js_1 = require("./process-params.js");
const encode_query_string_js_1 = require("./encode-query-string.js");
const arcgis_rest_form_data_1 = require("@esri/arcgis-rest-form-data");
/**
 * Encodes parameters in a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object in browsers or in a [FormData](https://github.com/form-data/form-data) in Node.js
 *
 * @param params An object to be encoded.
 * @returns The complete [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object.
 */
function encodeFormData(params, forceFormData) {
    // see https://github.com/Esri/arcgis-rest-js/issues/499 for more info.
    const useFormData = (0, process_params_js_1.requiresFormData)(params) || forceFormData;
    const newParams = (0, process_params_js_1.processParams)(params);
    if (useFormData) {
        const formData = new arcgis_rest_form_data_1.FormData();
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
        return (0, encode_query_string_js_1.encodeQueryString)(params);
    }
}
exports.encodeFormData = encodeFormData;
//# sourceMappingURL=encode-form-data.js.map