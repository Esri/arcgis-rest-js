// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_MATCHER = /[\x00-\x1F\x7F-\x9F\xA0]/g;

/**
 * Returns a new string with all control characters removed.
 *
 * Doesn't remove characters from input string.
 *
 * @param str - the string to scrub
 */
export function scrubControlChars (str: string) {
  return str.replace(CONTROL_CHAR_MATCHER, "");
}
