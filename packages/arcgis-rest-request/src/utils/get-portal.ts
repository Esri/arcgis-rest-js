/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "../request";

import { getPortalUrl } from "./get-portal-url";

export interface IPortal {
  id: string;
  isPortal: boolean;
  name: string;
  [key: string]: any;
}

/**
 * Get the portal
 * @param requestOptions
 */
export function getSelf(requestOptions?: IRequestOptions): Promise<IPortal> {
  // just delegate to getPortal w/o an id
  return getPortal(null, requestOptions);
}

/**
 * Get a portal by id. If no id is passed, it will call portals/self
 * @param id
 * @param requestOptions
 */
export function getPortal(
  id?: string,
  requestOptions?: IRequestOptions
): Promise<IPortal> {
  // construct the search url
  const idOrSelf = id ? id : "self";
  const url = `${getPortalUrl(requestOptions)}/portals/${idOrSelf}`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };

  // send the request
  return request(url, options);
}
