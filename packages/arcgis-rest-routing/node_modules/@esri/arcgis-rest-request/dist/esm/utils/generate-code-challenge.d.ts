/**
 * Utility to hash the codeVerifier using sha256
 */
export declare function generateCodeChallenge(codeVerifier: string, win?: Window & typeof globalThis): Promise<any>;
