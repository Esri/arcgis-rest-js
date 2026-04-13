/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// This file should be removed with the completion of ArcGIS REST JS v5.0 release.
import { _ILegacyRequestOptions } from "./IRequestOptions.js";
import { warn } from "./warn.js";

const DEPRECATED_REQUEST_OPTION_KEYS: Array<keyof _ILegacyRequestOptions> = [
  // request options
  "suppressWarnings",
  "hideToken",
  // fetch options
  "httpMethod",
  "credentials",
  "headers",
  "signal",
  // RESTJS options
  "portal",
  "maxUrlLength",
  "rawResponse",
  "request"
];

const DEPRECATED_REQUEST_OPTION_REPLACEMENTS: Partial<
  Record<keyof _ILegacyRequestOptions, string>
> = {
  hideToken: "requestOptions.hideToken",
  suppressWarnings: "requestOptions.suppressWarnings",
  httpMethod: "fetchOptions.method",
  credentials: "fetchOptions.credentials",
  headers: "fetchOptions.headers",
  signal: "fetchOptions.signal"
};

function getDeprecatedRequestOptionWarning(
  key: keyof _ILegacyRequestOptions
): string {
  const replacement = DEPRECATED_REQUEST_OPTION_REPLACEMENTS[key];
  return `${key} is deprecated as a top-level request option and will be removed in ArcGIS REST JS v5.0.${
    replacement ? ` Use ${replacement} instead.` : ""
  }`;
}

export function warnOnDeprecatedRequestOptions(
  options?: Partial<_ILegacyRequestOptions>
): void {
  if (!options) {
    return;
  }

  DEPRECATED_REQUEST_OPTION_KEYS.forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(options, key) &&
      (options as any)[key] !== undefined
    ) {
      warn(getDeprecatedRequestOptionWarning(key));
    }
  });
}
