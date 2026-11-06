/* Copyright (c) 2026 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

type HeaderMap = {
  [key: string]: string;
};

function appendHeaders(target: HeaderMap, headers?: HeadersInit): void {
  if (!headers) {
    return;
  }

  if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      target[key] = String(value);
    });
    return;
  }

  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    headers.forEach((value, key) => {
      target[key] = value;
    });
    return;
  }

  Object.entries(headers).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      target[key] = String(value);
    }
  });
}

export function mergeHeaders(...headerSets: Array<HeadersInit | undefined>) {
  const mergedHeaders: HeaderMap = {};

  headerSets.forEach((headers) => {
    appendHeaders(mergedHeaders, headers);
  });

  return mergedHeaders;
}
