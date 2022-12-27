import { request } from "@esri/arcgis-rest-request";
import { determineOwner } from "./helpers.js";
import { getPortalUrl } from "../util/get-portal-url.js";
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
export const exportItem = (requestOptions) => {
    const { authentication, id: itemId, title, exportFormat, exportParameters } = requestOptions;
    return determineOwner(requestOptions)
        .then((owner) => `${getPortalUrl(requestOptions)}/content/users/${owner}/export`)
        .then((url) => request(url, {
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
//# sourceMappingURL=export.js.map