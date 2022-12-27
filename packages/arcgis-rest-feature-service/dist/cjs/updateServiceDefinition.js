"use strict";
/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceDefinition = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Update a definition property in a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/online/update-definition-feature-service-.htm) for more information.
 *
 * ```js
 * import { updateServiceDefinition } from '@esri/arcgis-rest-service-admin';
 * //
 * updateServiceDefinition(serviceurl, {
 *   authentication: ArcGISIdentityManager,
 *   updateDefinition: serviceDefinition
 * });
 * ```
 *
 * @param url - URL of feature service
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with success or error
 */
function updateServiceDefinition(url, requestOptions) {
    const adminUrl = `${(0, arcgis_rest_request_1.cleanUrl)(url).replace(`/rest/services`, `/rest/admin/services`)}/updateDefinition`;
    requestOptions.params = Object.assign({ updateDefinition: {} }, requestOptions.params);
    if (requestOptions.updateDefinition) {
        requestOptions.params.updateDefinition = requestOptions.updateDefinition;
    }
    return (0, arcgis_rest_request_1.request)(adminUrl, requestOptions);
}
exports.updateServiceDefinition = updateServiceDefinition;
//# sourceMappingURL=updateServiceDefinition.js.map