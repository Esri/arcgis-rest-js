/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// This file should be removed with the completion of ArcGIS REST JS v5.0 release.
import { ILegacyRequestOptions } from "./IRequestOptions.js";
import { warn } from "./warn.js";

const DEPRECATED_REQUEST_OPTION_KEYS: Array<keyof ILegacyRequestOptions> = [
  // request options
  "suppressWarnings",
  "hideToken",
  // fetch options
  "httpMethod",
  "credentials",
  "headers",
  "signal",
  // RESTJS options
  "maxUrlLength",
  "rawResponse",
  "request"
];

const DEPRECATED_REQUEST_OPTION_REPLACEMENTS: Partial<
  Record<keyof ILegacyRequestOptions, string>
> = {
  hideToken: "requestFlags.hideToken",
  suppressWarnings: "requestFlags.suppressWarnings",
  httpMethod: "fetchOptions.method",
  credentials: "fetchOptions.credentials",
  headers: "fetchOptions.headers",
  signal: "fetchOptions.signal"
};

function getDeprecatedRequestOptionWarning(
  key: keyof ILegacyRequestOptions
): string {
  const replacement = DEPRECATED_REQUEST_OPTION_REPLACEMENTS[key];
  return `${key} is deprecated as a top-level request option and will be removed in ArcGIS REST JS v5.0.${
    replacement ? ` Use ${replacement} instead.` : ""
  }`;
}

export function warnOnDeprecatedRequestOptions(
  options?: Partial<ILegacyRequestOptions>
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
