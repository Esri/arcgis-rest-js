/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl } from "@esri/arcgis-rest-request";
/**
 * Feature Service request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/feature-service.htm) for more information.
 *
 * ```js
 * import { getService } from '@esri/arcgis-rest-feature-service';
 * //
 * getService({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer"
 * })
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 *
 * @param options - Options for the request.
 * @returns A Promise that will resolve with the getService response.
 */
export function getService(options) {
    return request(cleanUrl(options.url), options);
}
//# sourceMappingURL=getService.js.map