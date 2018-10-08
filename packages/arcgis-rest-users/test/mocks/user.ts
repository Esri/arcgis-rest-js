/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IUser } from "@esri/arcgis-rest-common-types";

export const AnonUserResponse: IUser = {
  username: "jsmith",
  fullName: "John Smith",
  firstName: "John",
  lastName: "Smith",
  description: "Senior GIS Analyst for the city of Redlands.",
  tags: ["GIS Analyst", "City of Redlands"],
  culture: "en",
  region: "US",
  units: "metric",
  thumbnail: "myProfile.jpg",
  created: 1258501046000,
  modified: 1290625562000,
  provider: "arcgis"
};

export const GroupMemberUserResponse: IUser = {
  ...AnonUserResponse,
  availableCredits: 479.50998,
  assignedCredits: 500.0,
  preferredView: "Web",
  email: "jsmith33@esri.com",
  idpUsername: "null",
  favGroupId: "829e32cca4dd475a8bb63bb56b16fe3e",
  lastLogin: 1385766284000,
  mfaEnabled: false,
  access: "public",
  storageUsage: 583650,
  storageQuota: 2147483648,
  orgId: "qWAReEOCnD7eTxOe",
  role: "org_publisher",
  privileges: [
    "portal:admin:deleteItems",
    "portal:admin:reassignItems",
    "portal:admin:updateItems",
    "portal:admin:viewItems",
    "portal:admin:viewUsers",
    "portal:user:createGroup",
    "portal:user:createItem",
    "portal:user:joinGroup",
    "portal:user:shareToGroup",
    "portal:user:shareToOrg"
  ],
  roleId: "RDnHQBSBbsJuIkUp",
  level: "2",
  disabled: false,
  groups: [
    {
      id: "t6b",
      title: "Street Maps",
      isInvitationOnly: false,
      owner: "whoknows",
      description:
        "The street map group provides street maps for the city of Redlands.",
      snippet: "City of Redlands maps",
      tags: ["Redlands", "street", "maps"],
      phone: "http://www.esri.com",
      thumbnail: "streets.jpg",
      created: 1258501221000,
      modified: 1272309404000,
      access: "org",
      userMembership: {
        username: "jsmith",
        memberType: "member",
        applications: 0
      },
      protected: false,
      isViewOnly: false,
      isFav: false,
      isOpenData: true,
      autoJoin: false
    }
  ]
};

export const GroupNonMemberUserResponse: IUser = {
  ...GroupMemberUserResponse,
  groups: [
    {
      id: "abc",
      title: "Street Maps",
      isInvitationOnly: false,
      owner: "whoknows",
      description:
        "The street map group provides street maps for the city of Redlands.",
      snippet: "City of Redlands maps",
      tags: ["Redlands", "street", "maps"],
      phone: "http://www.esri.com",
      thumbnail: "streets.jpg",
      created: 1258501221000,
      modified: 1272309404000,
      access: "org",
      userMembership: {
        username: "jsmith",
        memberType: "member",
        applications: 0
      },
      protected: false,
      isViewOnly: false,
      isFav: false,
      isOpenData: true,
      autoJoin: false
    }
  ]
};

export const GroupAdminUserResponse = {
  ...GroupMemberUserResponse,
  groups: [
    {
      id: "t6b",
      title: "Street Maps",
      isInvitationOnly: false,
      owner: "whoknows",
      description:
        "The street map group provides street maps for the city of Redlands.",
      snippet: "City of Redlands maps",
      tags: ["Redlands", "street", "maps"],
      phone: "http://www.esri.com",
      thumbnail: "streets.jpg",
      created: 1258501221000,
      modified: 1272309404000,
      access: "org",
      userMembership: {
        username: "jsmith",
        memberType: "admin",
        applications: 0
      },
      protected: false,
      isViewOnly: false,
      isFav: false,
      isOpenData: true,
      autoJoin: false
    }
  ]
};

export const OrgAdminUserResponse = {
  ...GroupAdminUserResponse,
  role: "org_admin",
  groups: [
    {
      id: "t6b",
      title: "Street Maps",
      isInvitationOnly: false,
      owner: "whoknows",
      description:
        "The street map group provides street maps for the city of Redlands.",
      snippet: "City of Redlands maps",
      tags: ["Redlands", "street", "maps"],
      phone: "http://www.esri.com",
      thumbnail: "streets.jpg",
      created: 1258501221000,
      modified: 1272309404000,
      access: "org",
      userMembership: {
        username: "jsmith",
        memberType: "owner",
        applications: 0
      },
      protected: false,
      isViewOnly: false,
      isFav: false,
      isOpenData: true,
      autoJoin: false
    }
  ]
};
