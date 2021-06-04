/* Copyright (c) 2017-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export function decodeParam(param: string): { key: string; value: string } {
  const [key, value] = param.split("=");
  return { key: decodeURIComponent(key), value: decodeURIComponent(value) };
}

/**
 * Decodes the passed query string as an object.
 *
 * @param query A string to be decoded.
 * @returns A decoded query param object.
 */
export function decodeQueryString(query: string): { [key: string]: string } {
  return query
    .replace(/^#/, "")
    .split("&")
    .reduce((acc, entry) => {
      const { key, value } = decodeParam(entry);
      acc[key] = value;
      return acc;
    }, {} as any);
}
