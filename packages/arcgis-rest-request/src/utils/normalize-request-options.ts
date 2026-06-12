/* Copyright (c) 2026 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";
import { normalizeDeprecatedRequestOptions } from "./normalize-deprecated-request-options.js";

type DeprecatedOptionsWarner = (
  requestOptions: IRequestOptions,
  suppressWarnings: boolean
) => void;

/**
 * Normalizes request options by translating legacy options to their current equivalents,
 * applying defaults, and deeply merging params/requestFlags/fetchOptions.headers.
 * Should be removed at the end of v5 with ILegacyRequestOptions and all deprecated options.
 */
export function normalizeRequestOptions(
  requestOptions: IRequestOptions,
  defaultRequestOptions: IRequestOptions = {},
  warnOnDeprecatedRequestOptions?: DeprecatedOptionsWarner
): IRequestOptions {
  const suppressWarnings =
    requestOptions.requestFlags?.suppressWarnings ??
    requestOptions.suppressWarnings ??
    false;

  if (warnOnDeprecatedRequestOptions) {
    warnOnDeprecatedRequestOptions(requestOptions, suppressWarnings);
  }

  const normalizedRequestOptions =
    normalizeDeprecatedRequestOptions(requestOptions);
  const defaults = normalizeDeprecatedRequestOptions(defaultRequestOptions);

  return {
    ...{ fetchOptions: { method: "POST" } },
    ...defaults,
    ...normalizedRequestOptions,
    ...{
      params: {
        ...defaults.params,
        ...normalizedRequestOptions.params
      },
      requestFlags: {
        ...defaults.requestFlags,
        ...normalizedRequestOptions.requestFlags
      },
      fetchOptions: {
        ...defaults.fetchOptions,
        ...normalizedRequestOptions.fetchOptions,
        headers: {
          ...(defaults.fetchOptions?.headers as any),
          ...(normalizedRequestOptions.fetchOptions?.headers as any)
        }
      }
    }
  };
}
