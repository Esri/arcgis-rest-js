/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { cleanUrl } from "@esri/arcgis-rest-request";
const serviceRegex = new RegExp(/.+(?:map|feature|image)server/i);
/**
 * Return the service url. If not matched, returns what was passed in
 */
export function parseServiceUrl(url) {
    const match = url.match(serviceRegex);
    if (match) {
        return match[0];
    }
    else {
        return stripQueryString(url);
    }
}
function stripQueryString(url) {
    const stripped = url.split("?")[0];
    return cleanUrl(stripped);
}
//# sourceMappingURL=helpers.js.map