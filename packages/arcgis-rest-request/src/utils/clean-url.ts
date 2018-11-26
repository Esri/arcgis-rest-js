/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Helper method to ensure that user supplied urls don't include whitespace or a trailing slash.
 */
export function cleanUrl(url: string) {
  // trim leading and trailing spaces, but not spaces inside the url
  url = url.trim();

  // remove the trailing slash to the url if one was included
  if (url[url.length - 1] === "/") {
    url = url.slice(0, -1);
  }
  return url;
}
