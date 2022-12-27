"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = void 0;
const base_64_url_js_1 = require("./base-64-url.js");
/**
 * Utility to generate a random string to use as our `code_verifier`
 *
 * @param win the global `window` object for accepting a mock while testing.
 */
function generateRandomString(win) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
        win = window;
    }
    const randomBytes = win.crypto.getRandomValues(new Uint8Array(32));
    return (0, base_64_url_js_1.base64UrlEncode)(randomBytes);
}
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=generate-random-string.js.map