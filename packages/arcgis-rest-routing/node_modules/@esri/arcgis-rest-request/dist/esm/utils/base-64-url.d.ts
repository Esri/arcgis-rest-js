/**
 * Encodes a `Uint8Array` to base 64. Used internally for hashing the `code_verifier` and `code_challenge` for PKCE.
 */
export declare function base64UrlEncode(value: any, win?: Window & typeof globalThis): string;
