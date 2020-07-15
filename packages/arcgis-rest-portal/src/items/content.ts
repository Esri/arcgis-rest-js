import {
  request,
  IRequestOptions
} from "@esri/arcgis-rest-request";
import { IPagingParams, IItem, IPagedResponse } from '@esri/arcgis-rest-types';
import { getPortalUrl } from "../util/get-portal-url";

export type UnixTime = number;

export interface IUserContentRequestOptions extends IPagingParams, IRequestOptions {
  username: string;
}

export interface IFolder {
  username: string;
  id: string;
  title: string;
  created: UnixTime;
}

export interface IUserContentResponse extends IPagedResponse {
  username: string;
  currentFolder?: IFolder;
  items: IItem[];
}

/**
 * ```js
 * import { getUserContent } from "@esri/arcgis-rest-portal";
 * //
 * getUserContent({
 *    username: 'geemike',
 *    start: 1,
 *    num: 20,
 *    authentication
 * })
 * ```
 * Returns a listing of the user's content. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-content.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise<IUserContentResponse>
 */
export const getUserContent = (requestOptions: IUserContentRequestOptions): Promise<IUserContentResponse> => {
  const { start = 1, num = 10, username, authentication } = requestOptions;
  const url = `${getPortalUrl(requestOptions)}/content/users/${username}`;

  return request(url, {
    httpMethod: 'GET',
    authentication,
    params: {
      start,
      num
    }
  });
}
