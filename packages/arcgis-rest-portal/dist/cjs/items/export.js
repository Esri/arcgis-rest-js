"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportItem = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Exports an item from the portal. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/export-item.htm) for more information.
 *
 * ```js
 * import { exportItem } from "@esri/arcgis-rest-portal";
 *
 * exportItem({
 *   id: '3daf',
 *   owner: 'geemike',
 *   exportFormat: 'CSV',
 *   exportParameters: {
 *     layers: [
 *       { id: 0 },
 *       { id: 1, where: 'POP1999 > 100000' }
 *     ]
 *   },
 *   authentication,
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise<IExportItemResponse>
 */
const exportItem = (requestOptions) => {
    const { authentication, id: itemId, title, exportFormat, exportParameters } = requestOptions;
    return (0, helpers_js_1.determineOwner)(requestOptions)
        .then((owner) => `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/export`)
        .then((url) => (0, arcgis_rest_request_1.request)(url, {
        httpMethod: "POST",
        authentication,
        params: {
            itemId,
            title,
            exportFormat,
            exportParameters
        }
    }));
};
exports.exportItem = exportItem;
//# sourceMappingURL=export.js.map