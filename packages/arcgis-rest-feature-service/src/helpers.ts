/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  esriGeometryType,
  SpatialRelationship,
  IGeometry,
  ISpatialReference
} from "@esri/arcgis-rest-common-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";

import { IQueryFeaturesRequestOptions } from "./query";
import { IAddFeaturesRequestOptions } from "./add";
import { IUpdateFeaturesRequestOptions } from "./update";
import { IDeleteFeaturesRequestOptions } from "./delete";
import { IQueryRelatedRequestOptions } from "./queryRelated";

export interface ISharedQueryParams {
  where?: string;
  geometry?: IGeometry;
  geometryType?: esriGeometryType;
  // NOTE: either WKID or ISpatialReference
  inSR?: string | ISpatialReference;
  spatialRel?: SpatialRelationship;
}

/**
 * Add, update and delete features result Object.
 */
export interface IEditFeatureResult {
  objectId: number;
  globalId?: string;
  success: boolean;
}

/**
 * Common add and update features parameters.
 */
export interface IEditFeaturesParams {
  /**
   * The geodatabase version to apply the edits.
   */
  gdbVersion?: string;
  /**
   * Optional parameter specifying whether the response will report the time features were added.
   */
  returnEditMoment?: boolean;
  /**
   * Optional parameter to specify if the edits should be applied only if all submitted edits succeed.
   */
  rollbackOnFailure?: boolean;
}

/**
 * Used internally by the package to ensure that first order request options are passed through as request parameters.
 */
export function appendCustomParams(
  oldOptions:
    | IQueryFeaturesRequestOptions
    | IAddFeaturesRequestOptions
    | IUpdateFeaturesRequestOptions
    | IDeleteFeaturesRequestOptions
    | IQueryRelatedRequestOptions,
  newOptions: IRequestOptions
) {
  // only pass query parameters through in the request, not generic IRequestOptions props
  Object.keys(oldOptions).forEach(function(key: string) {
    if (
      key !== "url" &&
      key !== "params" &&
      key !== "authentication" &&
      key !== "httpMethod" &&
      key !== "fetch" &&
      key !== "portal" &&
      key !== "maxUrlLength"
    ) {
      newOptions.params[key] = (oldOptions as { [key: string]: any })[key];
    }
  });
}
