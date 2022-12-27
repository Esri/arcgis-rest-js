"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserContent = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const helpers_js_1 = require("./helpers.js");
/**
 * Returns a listing of the user's content. If the `username` is not supplied, it defaults to the username of the authenticated user. If `start` is not specified it defaults to the first page.
 *
 * If the `num` is not supplied it is defaulted to 10. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-content.htm) for more information.
 *
 * ```js
 * import { getUserContent } from "@esri/arcgis-rest-portal";
 *
 * getUserContent({
 *    owner: 'geemike',
 *    folderId: 'bao7',
 *    start: 1,
 *    num: 20,
 *    authentication
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise<IUserContentResponse>
 */
const getUserContent = (requestOptions) => {
    const { folderId: folder, start = 1, num = 10, authentication } = requestOptions;
    const suffix = folder ? `/${folder}` : "";
    return (0, helpers_js_1.determineOwner)(requestOptions)
        .then((owner) => `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}${suffix}`)
        .then((url) => (0, arcgis_rest_request_1.request)(url, {
        httpMethod: "GET",
        authentication,
        params: {
            start,
            num
        }
    }));
};
exports.getUserContent = getUserContent;
//# sourceMappingURL=content.js.map