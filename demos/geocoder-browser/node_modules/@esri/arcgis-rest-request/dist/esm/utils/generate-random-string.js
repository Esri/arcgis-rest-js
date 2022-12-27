import { base64UrlEncode } from "./base-64-url.js";
/**
 * Utility to generate a random string to use as our `code_verifier`
 *
 * @param win the global `window` object for accepting a mock while testing.
 */
export function generateRandomString(win) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
        win = window;
    }
    const randomBytes = win.crypto.getRandomValues(new Uint8Array(32));
    return base64UrlEncode(randomBytes);
}
//# sourceMappingURL=generate-random-string.js.map