/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IRequestOptions } from "../request";

/**
 * Helper that returns the portalUrl - either defaulting to www.arcgis.com or using
 * the passed in auth manager's .portal property
 * 
 * @param requestOptions - Request options that may have authentication manager
 * @returns Portal url to be used in API requests
 */
export function getPortalUrl(requestOptions?: IRequestOptions): string {
  // default to arcgis.com
  let portalUrl = "https://www.arcgis.com/sharing/rest";
  // but if the auth was passed, use that portal...
  if (requestOptions && requestOptions.authentication) {
    portalUrl = requestOptions.authentication.portal;
  }

  return portalUrl;
}
