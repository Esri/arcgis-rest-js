/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "../request";

/**
 * Helper for methods with lots of first order request options to pass them through as request parameters.
 */
export function appendCustomParams(
  oldOptions: IRequestOptions,
  newOptions: IRequestOptions
) {
  // only pass query parameters through in the request, not generic IRequestOptions props
  Object.keys(oldOptions).forEach(function(key: string) {
    if (
      key !== "url" &&
      key !== "params" &&
      key !== "authentication" &&
      key !== "httpMethod" &&
      key !== "fetch" &&
      key !== "portal" &&
      key !== "maxUrlLength" &&
      key !== "endpoint"
    ) {
      newOptions.params[key] = (oldOptions as { [key: string]: any })[key];
    }
  });
}
