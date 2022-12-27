"use strict";
/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueServiceName = void 0;
const is_service_name_available_js_1 = require("./is-service-name-available.js");
/**
 * Given a starting name, return a service name that is unique within
 * the current users organization
 *
 * @export
 * @param {string} name
 * @param {ArcGISIdentityManager} session
 * @param {number} step
 * @return {*}  {Promise<string>}
 */
function getUniqueServiceName(name, type, session, step) {
    let nameToCheck = name;
    if (step) {
        nameToCheck = `${name}_${step}`;
    }
    return (0, is_service_name_available_js_1.isServiceNameAvailable)(nameToCheck, type, session).then((response) => {
        if (response.available) {
            return nameToCheck;
        }
        else {
            step = step + 1;
            return getUniqueServiceName(name, type, session, step);
        }
    });
}
exports.getUniqueServiceName = getUniqueServiceName;
//# sourceMappingURL=get-unique-service-name.js.map