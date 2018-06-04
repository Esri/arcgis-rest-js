import { UserSession } from "./UserSession";

import { IUserRequestOptions } from "./authenticated-request-options";
import { getPortalUrl, request, IParams } from "@esri/arcgis-rest-request";

/**
 * Returns information about the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). The information is cached to ensure that subsequent calls don't result in additional web traffic.
 *
 * ```js
 * import { getUserInfo } from '@esri/arcgis-rest-auth';
 *
 * const session = new UserSession({
 *   username: "jsmith",
 *   password: "123456"
 * })
 *
 * getUserInfo(session)
 *   .then(response => {
 *     console.log(response.role); // "org_admin"
 *   })
 * ```
 *
 * @param session UserSession associated with an authenticated user.
 * @returns A Promise that will resolve with the data from the response.
 */
export function getUserInfo(session: UserSession): Promise<IParams> {
  if (session.userInfo) {
    return new Promise(resolve => resolve(session.userInfo));
  } else {
    const url = `${session.portal}/community/users/${encodeURIComponent(
      session.username
    )}`;
    return request(url, {
      authentication: session,
      httpMethod: "GET"
    }).then(response => {
      session.userInfo = response;
      return response;
    });
  }
}
