/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroupSearchResult } from "../../src/search";
import { IGroupContentResult, IGroupUsersResult } from "../../src/get";

import { IGroup } from "@esri/arcgis-rest-common-types";

export const GroupSearchResponse: IGroupSearchResult = {
  query: "* AND owner:dcadmin",
  total: 358,
  start: 1,
  num: 1,
  nextStart: 2,
  results: [
    {
      id: "ef45564655144f15b5903d05a24493d9",
      title: "0 alex test",
      isInvitationOnly: false,
      owner: "dcadmin",
      description: null,
      snippet: "alex test",
      tags: ["7320", "test", "alex"],
      phone: null,
      sortField: "title",
      sortOrder: "asc",
      isViewOnly: false,
      isFav: false,
      isOpenData: true,
      thumbnail: null,
      created: 1427987785000,
      modified: 1490731120000,
      provider: null,
      providerGroupName: null,
      isReadOnly: false,
      access: "public",
      capabilities: [],
      protected: false,
      autoJoin: false,
      notificationsEnabled: false
    }
  ]
};

export const GroupEditResponse: any = {
  success: true,
  id: "3efakegroupid"
};

export const GroupUsersResponse: IGroupUsersResult = {
  owner: "vader",
  admins: ["vader", "tarkin"],
  users: ["luke", "leia"]
};

export const GroupResponse: IGroup = {
  id: "ef45564655144f15b5903d05a24493d9",
  title: "0 alex test",
  isInvitationOnly: false,
  owner: "dcadmin",
  description: "",
  snippet: "alex test",
  tags: ["7320", "test", "alex"],
  phone: "",
  sortField: "title",
  sortOrder: "asc",
  isViewOnly: false,
  isFav: false,
  isOpenData: true,
  thumbnail: null,
  created: 1427987785000,
  modified: 1490731120000,
  provider: null,
  providerGroupName: null,
  isReadOnly: false,
  access: "public",
  capabilities: [],
  userMembership: {
    username: "dcadmin",
    memberType: "owner",
    applications: 0
  },
  collaborationInfo: {},
  protected: false,
  autoJoin: false,
  notificationsEnabled: false
};

export const GroupContentResponse: IGroupContentResult = {
  total: 36,
  start: 1,
  num: 1,
  nextStart: 2,
  items: [
    {
      id: "59dd250ab1a54660b11f4f3434a3e481",
      owner: "dcadmin",
      created: 1410610860000,
      modified: 1498835611000,
      guid: null,
      name: "LivingAtlasThemes.pdf",
      title: "LivingAtlasThemes",
      type: "PDF",
      typeKeywords: ["Data", "Document", "PDF"],
      description: null,
      tags: ["doc"],
      snippet: null,
      thumbnail: "thumbnail/ago_downloaded.png",
      documentation: null,
      extent: [],
      categories: [],
      spatialReference: null,
      accessInformation: null,
      licenseInfo: "CC0",
      culture: "en-us",
      properties: null,
      url: null,
      proxyFilter: null,
      access: "public",
      size: 75476,
      appCategories: [],
      industries: [],
      languages: [],
      largeThumbnail: null,
      banner: null,
      screenshots: [],
      listed: false,
      numComments: 0,
      numRatings: 0,
      avgRating: 0,
      numViews: 1301,
      groupCategories: [],
      scoreCompleteness: 50,
      protected: false
    }
  ]
};

export const GroupNotificationResponse: any = {
  success: true
};
