import { base64UrlEncode } from "./base-64-url.js";
/**
 * Utility to hash the codeVerifier using sha256
 */
export function generateCodeChallenge(codeVerifier, win = window) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
        win = window;
    }
    if (codeVerifier && win.isSecureContext && win.crypto && win.crypto.subtle) {
        const encoder = new win.TextEncoder();
        const bytes = encoder.encode(codeVerifier);
        return win.crypto.subtle
            .digest("SHA-256", bytes)
            .then((buffer) => base64UrlEncode(new Uint8Array(buffer), win));
    }
    return Promise.resolve(null);
}
//# sourceMappingURL=generate-code-challenge.js.map