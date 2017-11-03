/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, IRequestOptions, IParams } from "@esri/arcgis-rest-request";

import { IExtent } from "@esri/arcgis-rest-common-types";

export interface IItem {
  id: string;
  owner: string;
  created: number;
  modified: number;
  guid?: string;
  name: string;
  title: string;
  type: string;
  typeKeywords: string[];
  description?: string;
  tags: string[];
  snippet?: string;
  thumbnail?: string;
  documentation?: string;
  extent: IExtent;
  categories: string[];
  spatialReference?: any;
  accessInformation?: any;
  licenseInfo?: any;
  culture: string;
  properties?: any;
  url?: string;
  proxyFilter?: any;
  access: string;
  size: number;
  appCategories: string[];
  industries: string[];
  languages: string[];
  largeThumbnail?: string;
  banner?: string;
  screenshots: string[];
  listed: boolean;
  ownerFolder: string;
  protected: boolean;
  commentsEnabled: boolean;
  numComments: number;
  numRatings: number;
  avgRating: number;
  numViews: number;
  itemControl: string;
  text?: string;
  data?: any;
}

export interface ISearchResult {
  query: string;
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: IItem[];
}

export function search(
  searchForm: any,
  requestOptions?: IRequestOptions
): Promise<ISearchResult> {
  const portalUrl = "https://www.arcgis.com/sharing/rest";
  // if (requestOptions.portal) {
  //   portalUrl = requestOptions.portal
  // }
  const url = `${portalUrl}/search`;

  // ensure this makes a GET request
  let options: IRequestOptions = {
    httpMethod: "GET"
  };
  if (requestOptions) {
    options = requestOptions;
  }
  return request(url, searchForm, options);
}
