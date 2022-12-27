"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchToken = void 0;
const request_js_1 = require("./request.js");
const FIVE_MINUTES_IN_MILLISECONDS = 5 * 60 * 1000;
function fetchToken(url, requestOptions) {
    const options = requestOptions;
    // we generate a response, so we can't return the raw response
    options.rawResponse = false;
    return (0, request_js_1.request)(url, options).then((response) => {
        const r = {
            token: response.access_token,
            username: response.username,
            expires: new Date(
            // convert seconds in response to milliseconds and add the value to the current time to calculate a static expiration timestamp
            // we subtract 5 minutes here to make sure that we refresh the token early if the user makes requests
            Date.now() + response.expires_in * 1000 - FIVE_MINUTES_IN_MILLISECONDS),
            ssl: response.ssl === true
        };
        if (response.refresh_token) {
            r.refreshToken = response.refresh_token;
        }
        if (response.refresh_token_expires_in) {
            r.refreshTokenExpires = new Date(
            // convert seconds in response to milliseconds and add the value to the current time to calculate a static expiration timestamp
            // we subtract 5 minutes here to make sure that we refresh the token early if the user makes requests
            Date.now() +
                response.refresh_token_expires_in * 1000 -
                FIVE_MINUTES_IN_MILLISECONDS);
        }
        return r;
    });
}
exports.fetchToken = fetchToken;
//# sourceMappingURL=fetch-token.js.map