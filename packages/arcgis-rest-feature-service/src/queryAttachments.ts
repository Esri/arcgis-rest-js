/* Copyright (c) 2026 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IField
} from "@esri/arcgis-rest-request";

import { IGetLayerOptions } from "./helpers.js";
import { IAttachmentInfo } from "./getAttachments.js";

/**
 * Attachment query request options. Additional arguments can be passed via the {@linkcode IQueryAttachmentsOptions.params} property. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-attachments-feature-service-layer/) for more information and a full list of parameters.
 */
export interface IQueryAttachmentsOptions extends IGetLayerOptions {
  objectIds?: number[];
  globalIds?: string[];
  definitionExpression?: string;
  attachmentsDefinitionExpression?: string;
  attachmentTypes?: string | string[];
  size?: number[];
  keywords?: string;
  returnUrl?: boolean;
  returnMetadata?: boolean;
  returnCountOnly?: boolean;
  resultOffset?: number;
  resultRecordCount?: number;
  orderByFields?: string | string[];
}

/**
 * Attachment group structure
 */
export interface IAttachmentGroup {
  parentObjectId: number;
  parentGlobalId?: string;
  attachmentInfos?: IAttachmentInfo[];
  count?: number;
}

/**
 * Query Attachments response structure
 */
export interface IQueryAttachmentsResponse {
  fields?: IField[];
  attachmentGroups: IAttachmentGroup[];
}

/**
 * Query the attachments for a feature service layer. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-attachments-feature-service-layer/) for more information.
 *
 * ```js
 * import { queryAttachments } from '@esri/arcgis-rest-feature-service'
 *
 * queryAttachments({
 *  url: "http://services.myserver/OrgID/ArcGIS/rest/services/Petroleum/KSPetro/FeatureServer/0",
 *  objectIds: [2, 4],
 *  attachmentTypes: ["image/jpeg"],
 *  returnUrl: true
 * })
 *  .then(response) // response.attachmentGroups
 * ```
 *
 * @param requestOptions
 * @returns A Promise that will resolve with the query response
 */
export function queryAttachments(
  requestOptions: IQueryAttachmentsOptions
): Promise<IQueryAttachmentsResponse> {
  const options = appendCustomParams<IQueryAttachmentsOptions>(
    requestOptions,
    [
      "objectIds",
      "globalIds",
      "definitionExpression",
      "attachmentsDefinitionExpression",
      "attachmentTypes",
      "size",
      "keywords",
      "returnUrl",
      "returnMetadata",
      "returnCountOnly",
      "resultOffset",
      "resultRecordCount",
      "orderByFields"
    ],
    {
      httpMethod: "GET",
      params: {
        ...requestOptions.params
      }
    }
  );

  return request(`${cleanUrl(requestOptions.url)}/queryAttachments`, options);
}
