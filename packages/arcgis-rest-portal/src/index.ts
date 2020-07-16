/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./items/add";
export * from "./items/content";
export * from "./items/create";
export * from "./items/get";
export * from "./items/protect";
export * from "./items/reassign";
export * from "./items/remove";
export * from "./items/search";
export * from "./items/update";
export * from "./items/helpers";
export * from "./items/upload";

export * from "./groups/add-users";
export * from "./groups/create";
export * from "./groups/get";
export * from "./groups/helpers";
export * from "./groups/notification";
export * from "./groups/protect";
export * from "./groups/remove";
export * from "./groups/search";
export * from "./groups/update";
export * from "./groups/update-user-membership";
export * from "./groups/join";

export * from "./users/get-user";
export * from "./users/get-user-tags";
export * from "./users/get-user-url";
export * from "./users/invitation";
export * from "./users/notification";
export * from "./users/search-users";
export * from "./users/update";

export * from "./sharing/access";
export * from "./sharing/group-sharing";
export * from "./sharing/helpers";

export * from "./util/get-portal";
export * from "./util/get-portal-settings";
export * from "./util/get-portal-url";
export * from "./util/search";
export * from "./util/SearchQueryBuilder";
// we dont export 'generic-search' because its an internal utility method
// export * from "./util/generic-search"; because its an internal utility method
export {
  IPagingParams,
  IPagedResponse,
  IUser,
  IItemAdd,
  IItemUpdate,
  IItem,
  IFolder,
  IGroupAdd,
  IGroup,
  GroupMembership
} from "@esri/arcgis-rest-types";
