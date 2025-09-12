import { IOAuthState } from "../types/oauthState.js";

export function encodeOauthState(
  stateId: string,
  state?: string | IOAuthState,
  originalUrl?: string
): string {
  if (typeof state === "string" || !state) {
    return JSON.stringify({ id: stateId, originalUrl });
  }
  return JSON.stringify({ id: stateId, ...state });
}
