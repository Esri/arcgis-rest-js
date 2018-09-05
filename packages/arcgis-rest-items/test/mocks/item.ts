/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-common-types";

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
  protected: false
};

export const ItemDataResponse: any = {
  source: "3ef",
  values: {
    key: "value"
  }
};
