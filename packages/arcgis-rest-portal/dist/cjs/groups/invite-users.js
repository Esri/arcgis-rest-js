"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteGroupUsers = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const array_js_1 = require("../util/array.js");
/**
 * Invites users to join a group. Operation success will be indicated by a flag on the return object. If there are any errors, they will be placed in an errors array on the return object.
 *
 * ```js
 * const authentication: IAuthenticationManager; // Typically passed into to the function
 *
 * const options: IInviteGroupUsersOptions = {
 *  id: 'group_id',
 *  users: ['ed', 'edd', 'eddy'],
 *  role: 'group-member',
 *  expiration: 20160,
 *  authentication
 * }
 *
 * const result = await inviteGroupUsers(options);
 *
 * const if_success_result_looks_like = {
 *  success: true
 * }
 *
 * const if_failure_result_looks_like = {
 *  success: false,
 *  errors: [ArcGISRequestError]
 * }
 * ```
 *
 * @param {IInviteGroupUsersOptions} options
 * @returns {Promise<IAddGroupUsersResult>}
 */
function inviteGroupUsers(options) {
    const id = options.id;
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(options)}/community/groups/${id}/invite`;
    const batches = _generateBatchRequests(options);
    const promises = batches.map((batch) => _sendSafeRequest(url, batch));
    return Promise.all(promises).then(_combineResults);
}
exports.inviteGroupUsers = inviteGroupUsers;
/**
 * @private
 */
function _generateBatchRequests(options) {
    const userBatches = (0, array_js_1.chunk)(options.users, 25);
    return userBatches.map((users) => _generateRequestOptions(users, options));
}
/**
 * @private
 */
function _generateRequestOptions(users, baseOptions) {
    const requestOptions = Object.assign({}, baseOptions);
    requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), { users, role: requestOptions.role, expiration: requestOptions.expiration });
    return requestOptions;
}
/**
 * @private
 */
function _sendSafeRequest(url, requestOptions) {
    return (0, arcgis_rest_request_1.request)(url, requestOptions).catch((error) => ({ errors: [error] }));
}
/**
 * @private
 */
function _combineResults(responses) {
    const success = responses.every((res) => res.success);
    const errors = responses.reduce((collection, res) => collection.concat(res.errors || []), []);
    const combined = { success };
    if (errors.length > 0) {
        combined.errors = errors;
    }
    return combined;
}
//# sourceMappingURL=invite-users.js.map