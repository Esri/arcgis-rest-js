import { DEFAULT_SAFETY_MARGIN } from "./defaults.js";

export function determineSafetyMargin(
  duration: number | undefined,
  safetyMargin: number | undefined
): number {
  if (safetyMargin) {
    return safetyMargin;
  }
  // common cases are
  // duration is 60 seconds, this will return a 1 second safety margin
  // duration is 43200 seconds, this will return a 300 second (5 minutes) safety margin
  return Math.min(Math.max(duration / 100, 1), DEFAULT_SAFETY_MARGIN);
}
