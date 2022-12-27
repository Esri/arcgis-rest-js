/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { determineOwner, getPortalUrl } from "@esri/arcgis-rest-portal";
/**
 * Create a new [hosted feature service](https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm). After the service has been created, call [`addToServiceDefinition()`](../addToServiceDefinition/) if you'd like to update it's schema.
 *
 * ```js
 * import {
 *   createFeatureService,
 *   addToServiceDefinition
 * } from '@esri/arcgis-rest-service-admin';
 * //
 * createFeatureService({
 *   authentication: ArcGISIdentityManager,
 *   item: {
 *     "name": "NewEmptyService",
 *     "capabilities": "Create,Delete,Query,Update,Editing"
 *   }
 * });
 * ```
 *
 * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
 * @returns A Promise that resolves with service details once the service has been created
 */
export function createFeatureService(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const options = Object.assign(Object.assign({}, requestOptions), { rawResponse: false });
        const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
        const folder = !options.folderId || options.folderId === "/"
            ? ""
            : "/" + options.folderId;
        const url = `${baseUrl}${folder}/createService`;
        // Create the service
        options.params = Object.assign({ createParameters: options.item, outputType: "featureService" }, options.params);
        return request(url, options);
    });
}
//# sourceMappingURL=createFeatureService.js.map