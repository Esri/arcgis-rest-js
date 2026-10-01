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

export interface IUserFoldersRequestOptions extends IRequestOptions {
  /**
   * Owner of the folders. If not present, the username of the authenticated user is utilized.
   */
  owner?: string;
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

/**
 * Returns a listing of the user's folders. If the `owner` is not supplied, it defaults to the username of the authenticated user. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-content.htm) for more information.
 *
 * ```js
 * import { getUserFolders } from "@esri/arcgis-rest-portal";
 *
 * getUserFolders({
 *    owner: 'geemike',
 *    authentication
 * })
 *   .then(folders) // [{ username: "geemike", id: "bao7", title: "My Folder", created: 1576264694000 }]
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with an array of the user's folders
 */
export const getUserFolders = (
  requestOptions: IUserFoldersRequestOptions
): Promise<IFolder[]> => {
  // all of the user's folders are returned with the root content listing
  // regardless of paging, so only a single item is requested
  return getUserContent({ ...requestOptions, start: 1, num: 1 }).then(
    (response) => response.folders || []
  );
};
