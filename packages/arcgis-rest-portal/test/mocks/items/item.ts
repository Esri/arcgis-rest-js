/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-types";
import {
  IGetRelatedItemsResponse,
  IGetItemGroupsResponse,
  IGetItemStatusResponse,
  IGetItemPartsResponse
} from "../../../src/items/get";

export const ItemSuccessResponse: any = {
  success: true,
  id: "3efakeitemid0000"
};

export const ItemResponse: IItem = {
  id: "4bc",
  owner: "jeffvader",
  title: "DS Plans",
  description: "The plans",
  snippet: "Yeah these are the ones",
  tags: ["plans", "star dust"],
  type: "Web Map",
  typeKeywords: ["Javascript", "hubSiteApplication"],
  properties: {
    parentId: "3eb"
  },
  created: 123,
  modified: 456,
  size: 123,
  numViews: 1337,
  protected: false
};

export const RelatedItemsResponse: IGetRelatedItemsResponse = {
  total: 1,
  relatedItems: [ItemResponse]
};

export const ItemDataResponse: any = {
  source: "3ef",
  values: {
    key: "value"
  }
};

export const ItemGroupResponse: IGetItemGroupsResponse = {
  admin: [
    {
      id: "2ecb37a8c8fb4051af9c086c25503bb0",
      title: "Street Maps",
      isInvitationOnly: false,
      owner: "jsmith",
      description:
        "The street maps group provides street maps for the city of Redlands.",
      snippet: null,
      tags: ["Redlands", "Street", "Maps"],
      phone: "909.555.1234",
      thumbnail: "streets.jpg",
      created: 1247082196000,
      modified: 1276793808000,
      access: "public",
      userMembership: {
        username: "jsmith",
        memberType: "owner",
        applications: 1
      },
      isFav: false,
      autoJoin: false,
      isViewOnly: false,
      protected: false
    }
  ],
  member: [
    {
      id: "bf51aa6e879e4676b683dcbefb0ab0a9",
      title: "Parks and Recreation",
      isInvitationOnly: true,
      owner: "swilson",
      description:
        "The Parks and Recreation group contains maps and applications used by the Parks Department.",
      snippet: null,
      tags: ["Redlands", "Parks", "Recreation"],
      phone: "909.555.1234",
      thumbnail: "parks.jpg",
      created: 1247082197000,
      modified: 1276793919000,
      access: "private",
      userMembership: {
        username: "jsmith",
        memberType: "member"
      },
      isFav: false,
      autoJoin: false,
      isViewOnly: false,
      protected: false
    }
  ],
  other: [
    {
      id: "dbc385ac1b7d4231b24b97750f0e633c",
      title: "Featured Maps and Apps",
      isInvitationOnly: true,
      owner: "city_redlands",
      description: "These items are featured on the gallery page.",
      snippet: null,
      tags: ["gallery", "Featured Maps", "Featured Apps"],
      phone: "909.555.1234",
      thumbnail: "gallery.jpg",
      created: 1327099662000,
      modified: 1327099662000,
      access: "public",
      userMembership: {
        username: "jsmith",
        memberType: "nonmember"
      },
      isFav: false,
      autoJoin: false,
      isViewOnly: false,
      protected: false
    }
  ]
};

export const ItemStatusResponse: IGetItemStatusResponse = {
  status: "completed",
  statusMessage: "completed",
  itemId: "1df"
};

export const ItemPartsResponse: IGetItemPartsResponse = {
  parts: [1]
};
