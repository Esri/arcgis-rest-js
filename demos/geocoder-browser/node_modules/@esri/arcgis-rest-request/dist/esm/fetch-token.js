/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "./request.js";
const FIVE_MINUTES_IN_MILLISECONDS = 5 * 60 * 1000;
export function fetchToken(url, requestOptions) {
    const options = requestOptions;
    // we generate a response, so we can't return the raw response
    options.rawResponse = false;
    return request(url, options).then((response) => {
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
//# sourceMappingURL=fetch-token.js.map