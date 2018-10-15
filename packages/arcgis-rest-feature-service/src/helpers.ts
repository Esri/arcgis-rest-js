/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { appendCustomParams } from "@esri/arcgis-rest-request";

import {
  esriGeometryType,
  SpatialRelationship,
  IGeometry,
  ISpatialReference
} from "@esri/arcgis-rest-common-types";

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

// this function has been moved into @esri/request. it is re-exported here for backwards compatibility
export { appendCustomParams };
