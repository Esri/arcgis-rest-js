import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem, IFolder, IPagingParams, IPagedResponse } from "../helpers.js";

import { getPortalUrl } from "../util/get-portal-url.js";
import { determineOwner } from "./helpers.js";

export type UnixTime = number;

export interface IUserContentRequestOptions
  extends IPagingParams,
    IRequestOptions {
  owner?: string;
  folderId?: string;
}

export interface IUserContentResponse extends IPagedResponse {
  username: string;
  currentFolder?: IFolder;
  items: IItem[];
  folders: IFolder[];
}

/**
 * Returns a listing of the user's content. If the `username` is not supplied, it defaults to the username of the authenticated user. If `start` is not specified it defaults to the first page.
 *
 * If the `num` is not supplied it is defaulted to 10. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-content.htm) for more information.
 *
 * ```js
 * import { getUserContent } from "@esri/arcgis-rest-portal";
 *
 * getUserContent({
 *    owner: 'geemike',
 *    folderId: 'bao7',
 *    start: 1,
 *    num: 20,
 *    authentication
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise<IUserContentResponse>
 */
export const getUserContent = (
  requestOptions: IUserContentRequestOptions
): Promise<IUserContentResponse> => {
  const {
    folderId: folder,
    start = 1,
    num = 10,
    authentication
  } = requestOptions;
  const suffix = folder ? `/${folder}` : "";

  return determineOwner(requestOptions)
    .then(
      (owner) =>
        `${getPortalUrl(requestOptions)}/content/users/${owner}${suffix}`
    )
    .then((url) =>
      request(url, {
        httpMethod: "GET",
        authentication,
        params: {
          start,
          num
        }
      })
    );
};
