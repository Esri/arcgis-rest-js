/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl } from "@esri/arcgis-rest-request";
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
export function updateServiceDefinition(url, requestOptions) {
    const adminUrl = `${cleanUrl(url).replace(`/rest/services`, `/rest/admin/services`)}/updateDefinition`;
    requestOptions.params = Object.assign({ updateDefinition: {} }, requestOptions.params);
    if (requestOptions.updateDefinition) {
        requestOptions.params.updateDefinition = requestOptions.updateDefinition;
    }
    return request(adminUrl, requestOptions);
}
//# sourceMappingURL=updateServiceDefinition.js.map