/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { chunk } from "../util/array.js";
/**
 * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm) for more information.
 *
 * ```js
 * import { removeGroupUsers } from "@esri/arcgis-rest-portal";
 *
 * removeGroupUsers({
 *   id: groupId,
 *   users: ["username1", "username2"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
export function removeGroupUsers(requestOptions) {
    const { id, users: usersToRemove } = requestOptions;
    const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/removeUsers`;
    const safeSend = (users) => {
        const options = Object.assign(Object.assign({}, requestOptions), { users, params: { users } });
        return request(url, options).catch((error) => ({ errors: [error] }));
    };
    // the ArcGIS REST API only allows to add no more than 25 users per request,
    // see https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm
    const promises = chunk(usersToRemove, 25).map((usersChunk) => safeSend(usersChunk));
    return Promise.all(promises).then((results) => {
        const filtered = (propName) => results
            .filter((result) => result[propName])
            .reduce((collection, result) => collection.concat(result[propName]), []);
        const errors = filtered("errors");
        const consolidated = {
            notRemoved: filtered("notRemoved")
        };
        return errors.length ? Object.assign(Object.assign({}, consolidated), { errors }) : consolidated;
    });
}
//# sourceMappingURL=remove-users.js.map