/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IUser } from "@esri/arcgis-rest-common-types";
import { INotificationResult } from "../../src/notification";
import { IInvitation, IInvitationResult } from "../../src/invitation";

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

export const UserNotificationsResponse: INotificationResult = {
  notifications: [
    {
      id: "7eee83bb4bc94c1e82bb5b931ab9a818",
      type: "message_received",
      target: "c@sey",
      targetType: "user",
      received: 1534788621000,
      data: {
        fromUser: "adminuser",
        subject: "this is the subject",
        message: "this is the message"
      }
    },
    {
      id: "e8c18248ee2f4eb298d443026982b59c",
      type: "group_join",
      target: "c@sey",
      targetType: "user",
      received: 1534788353000,
      data: {
        groupId: "0c943127d4a545e6874e4ee4e1f88fa8",
        groupTitle: "This is Jupe's Test Event"
      }
    }
  ]
};

export const IDeleteSuccessResponse: any = {
  success: true,
  notificationId: "3ef"
};

export const UserInvitationsResponse: IInvitationResult = {
  userInvitations: [
    {
      id: "G45ad52e7560e470598815499003c13f6",
      targetType: "group",
      targetId: "5d780fcf924e4e7ab1952a71472bc950",
      received: 1538516323000,
      accepted: false,
      mustApprove: false,
      email: null,
      role: "group_member",
      type: "user",
      dateAccepted: -1,
      expiration: 1539725923000,
      created: 1538516323000,
      username: "mjuniper_dcqa",
      fromUsername: {
        username: "dcadminqa"
      },
      groupId: "5d780fcf924e4e7ab1952a71472bc950"
    }
  ]
};

export const UserInvitationResponse: IInvitation = {
  id: "G45ad52e7560e470598815499003c13f6",
  targetType: "group",
  targetId: "5d780fcf924e4e7ab1952a71472bc950",
  received: 1538516323000,
  accepted: false,
  mustApprove: false,
  email: null,
  role: "group_member",
  type: "user",
  dateAccepted: -1,
  expiration: 1539725923000,
  created: 1538516323000,
  username: "mjuniper_dcqa",
  fromUsername: {
    username: "dcadminqa",
    fullname: "DcAdminQA QaExtDc"
  },
  group: {
    id: "5d780fcf924e4e7ab1952a71472bc950",
    title: "Jupe test group 2",
    isInvitationOnly: true,
    owner: "dcadminqa",
    description: null,
    snippet: null,
    tags: ["hub"],
    phone: null,
    sortField: "title",
    sortOrder: "asc",
    isViewOnly: false,
    thumbnail: null,
    created: 1538516296000,
    modified: 1538516296000,
    access: "public",
    capabilities: [],
    isFav: false,
    isReadOnly: false,
    protected: false,
    autoJoin: false,
    notificationsEnabled: false,
    provider: null,
    providerGroupName: null
  }
};
