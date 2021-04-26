/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { getPortalUrl } from "../util/get-portal-url";
import { isOrgAdmin } from "../sharing/helpers";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

interface IReassignItemOptions extends IUserRequestOptions {
  id: string;
  currentOwner: string;
  targetUsername: string;
  targetFolderName?: string;
}

interface IReassignItemResponse {
  success: boolean;
  itemId: string;
}

/**
 * ```js
 * import { reassignItem } from '@esri/arcgis-rest-portal';
 * //
 * reassignItem({
 *   id: "abc123",
 *   currentOwner: "charles",
 *   targetUsername: "leslie",
 *   authentication
 * })
 * ```
 * Reassign an item from one user to another.
 * Caller must be an org admin or the request will fail.
 * `currentOwner` and `targetUsername` must be in the same
 * organization or the request will fail
 * @param reassignOptions - Options for the request
 */
export function reassignItem(
  reassignOptions: IReassignItemOptions
): Promise<IReassignItemResponse> {
  return isOrgAdmin(reassignOptions).then(isAdmin => {
    if (!isAdmin) {
      throw Error(
        `Item ${reassignOptions.id} can not be reassigned because current user is not an organization administrator.`
      );
    }
    // we're operating as an org-admin
    const url = `${getPortalUrl(reassignOptions)}/content/users/${
      reassignOptions.currentOwner
    }/items/${reassignOptions.id}/reassign`;

    const opts = {
      params: {
        targetUsername: reassignOptions.targetUsername,
        targetFolderName: reassignOptions.targetFolderName
      },
      authentication: reassignOptions.authentication
    };
    return request(url, opts);
  });
}
