/**
 * Encodes a `Uint8Array` to base 64. Used internally for hashing the `code_verifier` and `code_challenge` for PKCE.
 */
export function base64UrlEncode(value: any, win = window) {
  /* istanbul ignore next -- @preserve: must pass in a mockwindow for tests so we can't cover the other branch */
  if (!win && window) {
    win = window;
  }
  return win
    .btoa(String.fromCharCode.apply(null, value))
    .replace(/\+/g, "-") // replace + with -
    .replace(/\//g, "_") // replace / with _
    .replace(/=+$/, ""); // trim trailing =
}
