/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// if you want to get *really* pedantic, nonmember is more _derived_
export type GroupMembership = "owner" | "admin" | "member" | "nonmember";

/**
 * A [Group](https://developers.arcgis.com/rest/users-groups-and-items/common-parameters.htm) that has not been created yet.
 */
export interface IGroupAdd {
  title: string;
  owner?: string;
  tags?: string[];
  description?: string;
  access?: "private" | "org" | "public";
  phone?: string;
  sortField?:
    | "title"
    | "owner"
    | "avgrating"
    | "numviews"
    | "created"
    | "modified";
  sortOrder?: "asc" | "desc";
  isViewOnly?: boolean;
  isInvitationOnly?: boolean;
  thumbnail?: string;
  autoJoin?: boolean;
  snippet?: string;
  [key: string]: any;
}

/**
 * Existing Portal [Group](https://developers.arcgis.com/rest/users-groups-and-items/group.htm).
 */
export interface IGroup extends IGroupAdd {
  id: string;
  owner: string;
  tags: string[];
  created: number;
  modified: number;
  protected: boolean;
  isInvitationOnly: boolean;
  isViewOnly: boolean;
  isOpenData?: boolean;
  isFav: boolean;
  autoJoin: boolean;
  userMembership?: {
    username?: string;
    memberType?: GroupMembership;
    applications?: number;
  };
  hasCategorySchema?: boolean;
}
