"use strict";
/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToServiceDefinition = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Add layer(s) and/or table(s) to a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-to-definition-feature-service-.htm) for more information.
 *
 *  ```js
 * import { addToServiceDefinition } from '@esri/arcgis-rest-service-admin';
 * //
 * addToServiceDefinition(serviceurl, {
 *   authentication: ArcGISIdentityManager,
 *   layers: [],
 *   tables: []
 * });
 * ```
 *
 * @param url - URL of feature service
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with service layer and/or table details once the definition
 * has been updated
 */
function addToServiceDefinition(url, requestOptions) {
    const adminUrl = `${(0, arcgis_rest_request_1.cleanUrl)(url).replace(`/rest/services`, `/rest/admin/services`)}/addToDefinition`;
    requestOptions.params = Object.assign({ addToDefinition: {} }, requestOptions.params);
    if (requestOptions.layers && requestOptions.layers.length > 0) {
        requestOptions.params.addToDefinition.layers = requestOptions.layers;
    }
    if (requestOptions.tables && requestOptions.tables.length > 0) {
        requestOptions.params.addToDefinition.tables = requestOptions.tables;
    }
    return (0, arcgis_rest_request_1.request)(adminUrl, requestOptions);
}
exports.addToServiceDefinition = addToServiceDefinition;
//# sourceMappingURL=addToServiceDefinition.js.map