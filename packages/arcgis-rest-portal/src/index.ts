/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./items/add.js";
export * from "./items/content.js";
export * from "./items/create.js";
export * from "./items/export.js";
export * from "./items/get.js";
export * from "./items/protect.js";
export * from "./items/reassign.js";
export * from "./items/remove.js";
export * from "./items/search.js";
export * from "./items/update.js";
export * from "./items/helpers.js";
export * from "./items/upload.js";

export * from "./groups/add-users.js";
export * from "./groups/remove-users.js";
export * from "./groups/invite-users.js";
export * from "./groups/create.js";
export * from "./groups/get.js";
export * from "./groups/helpers.js";
export * from "./groups/notification.js";
export * from "./groups/protect.js";
export * from "./groups/remove.js";
export * from "./groups/search.js";
export * from "./groups/update.js";
export * from "./groups/update-user-membership.js";
export * from "./groups/join.js";

export * from "./orgs/notification.js";

export * from "./users/get-user.js";
export * from "./users/get-user-tags.js";
export * from "./users/get-user-url.js";
export * from "./users/invitation.js";
export * from "./users/notification.js";
export * from "./users/search-users.js";
export * from "./users/update.js";

export * from "./sharing/access.js";
export * from "./sharing/share-item-with-group.js";
export * from "./sharing/unshare-item-with-group.js";
export * from "./sharing/is-item-shared-with-group.js";
export * from "./sharing/helpers.js";

export * from "./services/get-unique-service-name.js";
export * from "./services/is-service-name-available.js";

export * from "./util/get-portal.js";
export * from "./util/get-portal-settings.js";
export * from "./util/get-portal-url.js";
export * from "./util/scrub-control-chars.js";
export * from "./util/search.js";
export * from "./util/SearchQueryBuilder.js";

// we dont export 'generic-search' because its an internal utility method
// export * from "./util/generic-search"; because its an internal utility method

// Types that are used in this package are re-exported for convenience and
// to make the links work correctly in the documentation pages.
export * from "./helpers.js";
export type {
  IUser,
  IGroup,
  IGroupAdd,
  GroupMembership
} from "@esri/arcgis-rest-request";
