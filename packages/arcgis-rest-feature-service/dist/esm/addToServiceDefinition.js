/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl } from "@esri/arcgis-rest-request";
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
export function addToServiceDefinition(url, requestOptions) {
    const adminUrl = `${cleanUrl(url).replace(`/rest/services`, `/rest/admin/services`)}/addToDefinition`;
    requestOptions.params = Object.assign({ addToDefinition: {} }, requestOptions.params);
    if (requestOptions.layers && requestOptions.layers.length > 0) {
        requestOptions.params.addToDefinition.layers = requestOptions.layers;
    }
    if (requestOptions.tables && requestOptions.tables.length > 0) {
        requestOptions.params.addToDefinition.tables = requestOptions.tables;
    }
    return request(adminUrl, requestOptions);
}
//# sourceMappingURL=addToServiceDefinition.js.map