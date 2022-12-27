"use strict";
/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeatureService = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const arcgis_rest_portal_1 = require("@esri/arcgis-rest-portal");
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
function createFeatureService(requestOptions) {
    return (0, arcgis_rest_portal_1.determineOwner)(requestOptions).then((owner) => {
        const options = Object.assign(Object.assign({}, requestOptions), { rawResponse: false });
        const baseUrl = `${(0, arcgis_rest_portal_1.getPortalUrl)(requestOptions)}/content/users/${owner}`;
        const folder = !options.folderId || options.folderId === "/"
            ? ""
            : "/" + options.folderId;
        const url = `${baseUrl}${folder}/createService`;
        // Create the service
        options.params = Object.assign({ createParameters: options.item, outputType: "featureService" }, options.params);
        return (0, arcgis_rest_request_1.request)(url, options);
    });
}
exports.createFeatureService = createFeatureService;
//# sourceMappingURL=createFeatureService.js.map