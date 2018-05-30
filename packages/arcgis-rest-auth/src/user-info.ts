// import { ApplicationSession } from "./ApplicationSession";
import { UserSession } from "./UserSession";

import { IUserRequestOptions } from "./authenticated-request-options";
import { getPortalUrl, request } from "@esri/arcgis-rest-request";

export interface IUserInfo {
  role?: string;
}

/**
 * Used internally by packages for requests that require user authentication.
 */
export function getUserInfo(session: UserSession): Promise<IUserInfo> {
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
      // console.log(session.userInfo);
      session.userInfo = response;
      return response;
    });
  }
}
