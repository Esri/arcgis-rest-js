// These Types and Functions can land in rest-js
// a friendly name for the scope of the resource
// the API deals with clientIds, which are
// listed here https://confluencewikidev.esri.com/pages/viewpage.action?pageId=50561461
// Generally speaking, the UserResourceScope is a downcased version of the
// clientId. Hub is unique b/c Sites have their own clientId,

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { getObjectSize } from "../util/getObjectSize.js";

/**
 * @private
 * Defines the access for the resource. The access level can be one of the following:
 * - `userappprivate` Resource is available only to the user through the app from which resource was uploaded.
 * - `userprivateallapps`  Resource is available only to the user that uploaded the resource through any app.
 * - `allorgusersprivateapp` Resource is available to all members of the org as that of the resource owner and through the app that uploaded. We allow adding resource with level only if the user's access is either public or org.
 * - `public`  Resource is available to anyone (including anonymous access) through any app. We allow adding a resource at public level only if the user's access is public and the canSharePublic flag of the org is set to true.
 */
export type UserResourceAccess =
  /**
   * Resource is available only to the user through the app from which resource was uploaded.
   */
  | "userappprivate"
  // Resource is available only to the user that uploaded the resource through any app
  | "userprivateallapps"
  // resource is available to all members of the org as that of the resource owner and through
  // the app that uploaded. We allow adding resource with level only if the user's access is either public or org
  | "allorgusersprivateapp"
  // Resource is available to anyone (including anonymous access) through any app. We allow adding a
  // resource at public level only if the user's access is public and the canSharePublic flag of the org is set to true
  | "public";

/**
 * @private
 * Add an User-App Resource
 */
export interface IAddUserResource {
  /**
   * The filename of the resource
   */
  key: string;
  /**
   * The json object to store; will be stringified
   */
  data: Record<string, any>;
  /**
   * The access level for the resource
   */
  access: UserResourceAccess;
}

/**
 * @private
 * Information about a user app resource
 */
export interface IUserResourceInfo {
  /**
   * The filename of the resource
   */
  key: string;
  /**
   * The clientId of the app that created the resource
   */
  clientId: string;
  /**
   * The date the resource was created
   */
  created: string;
  /**
   * The size of the resource in bytes
   */
  size: number;
  /**
   * The access level for the resource
   */
  access: UserResourceAccess;
}

/**
 * @private
 * Returned when we get a list of resources for a user
 */
export interface IUserResourceListResponse {
  /**
   * The total number of resources
   */
  total: number;
  /**
   * The index of the first resource in the list
   */
  start: number;
  /**
   * The number of resources returned
   */
  num: number;
  /**
   * The next index to use to get the next set of resources
   */
  nextStart: number;
  /**
   * The list of resources
   */
  userResources: IUserResourceInfo[];
}

/**
 * @private
 * Set a User-App-Resource
 * By default this will fetch and merge with an existing resource.
 * Passing `true` as the last parameter,
 * @param resource
 * @param username
 * @param portalUrl
 * @param token
 * @param replace
 * @returns
 */
export async function setUserResource(
  resource: IAddUserResource,
  username: string,
  portalUrl: string,
  token: string,
  replace = false
): Promise<void> {
  // Ensure we are below 5MB max size
  if (getObjectSize(resource.data).megabytes > 4.95) {
    throw new Error(
      `User Resource is too large to store. Please ensure it is less than 5MB in size`
    );
  }

  let payload = resource.data;
  if (!replace) {
    let currentResource = {};
    try {
      currentResource = await getUserResource(
        username,
        resource.key,
        portalUrl,
        token
      );
    } catch (err) {
      // intentionally swallow so we return the default value
    }
    // extend current object witn updated object
    payload = { ...currentResource, ...resource.data };
  }
  const ro: IRequestOptions = {
    portal: portalUrl,
    httpMethod: "POST",
    params: {
      text: JSON.stringify(payload),
      access: resource.access,
      key: resource.key,
      token
    }
  };

  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/addResource`,
    ro
  );
}

/**
 * @private
 * Gets a user app resource
 * If the resource does not exist, this will throw. This can be wrapped in `failSafe`
 * configured to return an empty object.
 * @param username
 * @param key
 * @param portalUrl
 * @param token
 * @returns
 */
export function getUserResource(
  username: string,
  key: string,
  portalUrl: string,
  token: string
): Promise<Record<string, any>> {
  const ro: IRequestOptions = {
    portal: portalUrl
  };
  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/resources/${key}?token=${token}`,
    ro
  );
}

/**
 * @private
 * Remove a resource
 * Used primarily in tests, but can be useful if you need to clean up
 * settings that are no longer used
 * @param username
 * @param key
 * @param portalUrl
 * @param token
 * @returns
 */
export function removeUserResource(
  username: string,
  key: string,
  portalUrl: string,
  token: string
): Promise<Record<string, any>> {
  const ro: IRequestOptions = {
    portal: portalUrl,
    httpMethod: "POST",
    params: {
      key,
      token
    }
  };
  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/removeResource`,
    ro
  );
}

/**
 * @private
 * List user resources associated with the user/token.
 * Defaults to listing only resources associated with the app the token is associated with
 * @param username
 * @param portalUrl
 * @param token
 * @returns
 */
export function listUserResources(
  username: string,
  portalUrl: string,
  token: string,
  returnAllApps = false
): Promise<IUserResourceListResponse> {
  const ro: IRequestOptions = {
    portal: portalUrl
  };
  return request(
    `${portalUrl}/sharing/rest/community/users/${username}/resources?f=json&token=${token}&returnAllApps=${returnAllApps}`,
    ro
  ) as Promise<IUserResourceListResponse>;
}
