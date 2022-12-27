import { searchItems } from "../items/search.js";
/**
 * Find out whether or not an item is already shared with a group.
 *
 * ```js
 * import { isItemSharedWithGroup } from "@esri/arcgis-rest-portal";
 *
 * isItemSharedWithGroup({
 *   groupId: 'bc3,
 *   itemId: 'f56,
 *   authentication
 * })
 * .then(isShared => {})
 * ```
 
 *
 * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
 * @returns Promise that will resolve with true/false
 */
export function isItemSharedWithGroup(requestOptions) {
    const searchOpts = {
        q: `id: ${requestOptions.id} AND group: ${requestOptions.groupId}`,
        start: 1,
        num: 10,
        sortField: "title",
        authentication: requestOptions.authentication,
        httpMethod: "POST"
    };
    return searchItems(searchOpts).then((searchResponse) => {
        let result = false;
        if (searchResponse.total > 0) {
            result = searchResponse.results.some((itm) => {
                return itm.id === requestOptions.id;
            });
            return result;
        }
    });
}
//# sourceMappingURL=is-item-shared-with-group.js.map