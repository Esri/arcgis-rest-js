const CONTROL_CHAR_MATCHER = /[\x00-\x1F\x7F-\x9F\xA0]/g;

/**
 * Returns a string with all control characters removed.
 *
 * Doesn't remove characters
 *
 * @param str - the string to scrub
 */
export function scrubControlChars (str: string) {
  return str.replace(CONTROL_CHAR_MATCHER, "");
}