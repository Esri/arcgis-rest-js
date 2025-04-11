/**
 * Is the given URL the same origin as the current window?
 * Used to determine if we need to do any additional cross-origin
 * handling for the request.
 * @param url
 * @param win - optional window object to use for origin comparison
 *             (useful for testing)
 * @returns
 */
export function isSameOrigin(url: string, win?: Window | undefined): boolean {
  /* istanbul ignore next */
  if (!win && !window) {
    return false;
  } else {
    win = win || window;
    const origin = win.location?.origin;
    return url.startsWith(origin);
  }
}
