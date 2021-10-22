/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { 
  cleanUrl, 
  IRequestOptions,
  GeometryType,
  IGeometry,
  ISpatialReference
} from "@esri/arcgis-rest-request";

/**
 * The spatial relationship used to compare input geometries
 */
 export type SpatialRelationship =
 | "esriSpatialRelIntersects"
 | "esriSpatialRelContains"
 | "esriSpatialRelCrosses"
 | "esriSpatialRelEnvelopeIntersects"
 | "esriSpatialRelIndexIntersects"
 | "esriSpatialRelOverlaps"
 | "esriSpatialRelTouches"
 | "esriSpatialRelWithin";

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

const serviceRegex = new RegExp(/.+(?:map|feature|image)server/i);
/**
 * Return the service url. If not matched, returns what was passed in
 */
export function parseServiceUrl(url: string) {
  const match = url.match(serviceRegex);
  if (match) {
    return match[0];
  } else {
    return stripQueryString(url);
  }
}

function stripQueryString(url: string) {
  const stripped = url.split("?")[0];
  return cleanUrl(stripped);
}

export interface IStatisticDefinition {
  /**
   * Statistical operation to perform (count, sum, min, max, avg, stddev, var, percentile_cont, percentile_disc).
   */
  statisticType:
    | "count"
    | "sum"
    | "min"
    | "max"
    | "avg"
    | "stddev"
    | "var"
    | "percentile_cont"
    | "percentile_disc";
  /**
   * Parameters to be used along with statisticType. Currently, only applicable for percentile_cont (continuous percentile) and percentile_disc (discrete percentile).
   */
  statisticParameters?: {
    value: number;
    orderBy?: "asc" | "desc";
  };
  /**
   * Field on which to perform the statistical operation.
   */
  onStatisticField: string;
  /**
   * Field name for the returned statistic field. If outStatisticFieldName is empty or missing, the server will assign one. A valid field name can only contain alphanumeric characters and an underscore. If the outStatisticFieldName is a reserved keyword of the underlying DBMS, the operation can fail. Try specifying an alternative outStatisticFieldName.
   */
  outStatisticFieldName?: string;
}