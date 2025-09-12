import { IOAuthState } from "../types/oauthState.js";
import { generateRandomString } from "./generate-random-string.js";

export function getOauthStateId(
  state?: string | IOAuthState,
  win?: Window
): string {
  if (typeof state === "string") {
    return state;
  } else if (typeof state === "object") {
    return state.id;
  }
  return generateRandomString(win);
}
