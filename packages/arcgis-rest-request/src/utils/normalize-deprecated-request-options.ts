/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";
import { mergeHeaders } from "./merge-headers.js";

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
    headers: mergeHeaders(headers as any, requestOptions.fetchOptions?.headers)
  };

  const normalizedOptions: IRequestOptions = {
    // some packages extend IRequestOptions with additional properties that we want to preserve, so we spread the original requestOptions here and then override the known deprecated options with their new equivalents
    // then delete the deprecated options at the end to avoid duplication
    ...(requestOptions as any),
    params: requestOptions.params,
    authentication: requestOptions.authentication,
    portal: requestOptions.portal,
    requestFlags: requestFlags,
    fetchOptions: fetchOptions
  };

  // we are outright dropping support for maxUrlLength and rawResponse as top-level options and warning users separately
  delete (normalizedOptions as any).maxUrlLength;
  delete (normalizedOptions as any).rawResponse;
  // delete the deprecated options from the normalized options to avoid confusion and duplication with the new options
  delete (normalizedOptions as any).httpMethod;
  delete (normalizedOptions as any).credentials;
  delete (normalizedOptions as any).headers;
  delete (normalizedOptions as any).signal;
  delete (normalizedOptions as any).hideToken;
  delete (normalizedOptions as any).suppressWarnings;
  return normalizedOptions;
}
