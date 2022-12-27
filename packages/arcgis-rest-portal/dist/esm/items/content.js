import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { determineOwner } from "./helpers.js";
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
export const getUserContent = (requestOptions) => {
    const { folderId: folder, start = 1, num = 10, authentication } = requestOptions;
    const suffix = folder ? `/${folder}` : "";
    return determineOwner(requestOptions)
        .then((owner) => `${getPortalUrl(requestOptions)}/content/users/${owner}${suffix}`)
        .then((url) => request(url, {
        httpMethod: "GET",
        authentication,
        params: {
            start,
            num
        }
    }));
};
//# sourceMappingURL=content.js.map