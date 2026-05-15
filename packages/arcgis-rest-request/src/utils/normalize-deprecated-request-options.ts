/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";

/**
 * Converts deprecated top-level request options into their v2 IRequestOptions
 * equivalents under requestFlags and fetchOptions.
 */
export function normalizeDeprecatedRequestOptions(
  requestOptions: IRequestOptions = {}
): IRequestOptions {
  const {
    // fetch options
    httpMethod,
    credentials,
    headers,
    signal,
    // request options
    hideToken,
    suppressWarnings
  } = requestOptions;

  const requestFlags = {
    ...(hideToken !== undefined ? { hideToken } : {}),
    ...(suppressWarnings !== undefined ? { suppressWarnings } : {}),
    ...requestOptions.requestFlags
  };

  const fetchOptions = {
    ...(httpMethod !== undefined ? { method: httpMethod } : {}),
    ...(credentials !== undefined ? { credentials } : {}),
    ...(signal !== undefined ? { signal } : {}),
    ...requestOptions.fetchOptions,
    headers: {
      ...(headers as any),
      ...(requestOptions.fetchOptions?.headers as any)
    }
  };

  const normalizedOptions: IRequestOptions = {
    params: requestOptions.params,
    authentication: requestOptions.authentication,
    portal: requestOptions.portal,
    requestFlags: requestFlags,
    fetchOptions: fetchOptions
  };

  // we are outright dropping support for maxUrlLength and rawResponse as top-level options and warning users separately

  return normalizedOptions;
}
