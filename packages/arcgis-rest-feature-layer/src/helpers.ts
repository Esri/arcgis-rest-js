/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  GeometryType,
  SpatialRelationship,
  IGeometry,
  ISpatialReference,
} from "@esri/arcgis-rest-types";

/**
 * Base options for making requests against feature layers
 */
export interface IGetLayerOptions extends IRequestOptions {
  /**
   * Layer service url.
   */
  url: string;
}

export interface ISharedQueryOptions extends IGetLayerOptions {
  /**
   * A where clause for the query. Defaults to "1=1"
   */
  where?: string;
  geometry?: IGeometry;
  geometryType?: GeometryType;
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
 * `globalId` always returned with attachments via apply edits.
 */
export interface IApplyEditsAttachmentResult extends IEditFeatureResult {
  globalId: string;
}

/**
 * Apply edits result Object.
 */
export interface IApplyEditsResult {
  addResults: IEditFeatureResult[];
  updateResults: IEditFeatureResult[];
  deleteResults: IEditFeatureResult[];
  attachments?: {
    addResults?: IApplyEditsAttachmentResult[];
    updateResults?: IApplyEditsAttachmentResult[];
    deleteResults?: IApplyEditsAttachmentResult[];
  };
}

/**
 * Common add, update, and delete features options.
 */
export interface ISharedEditOptions extends IGetLayerOptions {
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
