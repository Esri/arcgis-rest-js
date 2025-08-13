/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  cleanUrl,
  IRequestOptions,
  GeometryType,
  IGeometry,
  ISpatialReference,
  IHasZM,
  IExtent,
  IField,
  IFeature
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
  /**
   * Error is optional and is only returned when `success` is `false`.
   */
  error?: {
    code: number;
    description: string;
  };
}

/**
 * Shared add/update attachment options for apply edits.
 */
interface IApplyEditsSharedAttachmentOptions {
  /**
   * Attachment file content type.
   */
  contentType: string;
  /**
   * Name of the file including extension.
   */
  name: string;
  /**
   * Upload id of file to be attached.
   */
  uploadId?: string;
  /**
   * Base 64 encoded data of attachment.
   */
  data?: string;
}

/**
 * Add attachment options for apply edits.
 */
export interface IApplyEditsAddAttachmentOptions
  extends IApplyEditsSharedAttachmentOptions {
  /**
   * Global id of attachment (must be provided by client).
   */
  globalId: string;
  /**
   * Global id of feature to attach.
   */
  parentGlobalId: string;
}

/**
 * Update attachment options for apply edits.
 */
export interface IApplyEditsUpdateAttachmentOptions
  extends IApplyEditsSharedAttachmentOptions {
  /**
   * Global id of attachment.
   */
  globalId: string;
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
   * Statistical operation to perform (count, sum, min, max, avg, stddev, var, percentile_cont, percentile_disc, EnvelopeAggregate, CentroidAggregate, ConvexHullAggregate).
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
    | "percentile_disc"
    | "EnvelopeAggregate"
    | "CentroidAggregate"
    | "ConvexHullAggregate"
    | "exceedslimit";
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

export interface ILayer {
  /** A unique identifying string for the layer. */
  id: any;
  /** Layer name */
  name?: string;
  /** Optional string containing the item ID of the service if it's registered on ArcGIS Online or your organization's portal. */
  itemId?: string;
  /** Indicates the layer type */
  layerType: string;
  /** Integer property used to determine the maximum scale at which the layer is displayed. */
  maxScale?: number;
  /** Integer property used to determine the minimum scale at which the layer is displayed. */
  minScale?: number;
  /** The degree of transparency applied to the layer on the client side, where 0 is full transparency and 1 is no transparency. */
  opacity?: number;
  /** Boolean property indicating whether to display in the legend. */
  showLegend?: boolean;
  /** A user-friendly string title for the layer that can be used in a table of contents. */
  title?: string;
  /**
   * Deprecated, use layerType instead.
   * @deprecated
   */
  type?: string;
  /** Boolean property determining whether the layer is initially visible in the web map. */
  visibility?: boolean;
  /** The URL to the layer. Not applicable to all layer types. */
  url?: string;
}

/**
 * Very generic structure representing the return value from the
 * /arcgis/rest/admin/services/<service-name>/FeatureServer?f=json response
 */
export interface IServiceInfo extends Record<string, unknown> {
  adminServiceInfo: {
    name: string;
    type: string;
    status: string;
    database: {
      datasource: {
        name: string;
      };
    };
  };
  layers: Record<string, unknown>[];
}

/**
 * Individual View Source entry
 */

export interface IViewServiceSource {
  name: string;
  type: string;
  url: string;
  serviceItemId: string;
}

/**
 * Response from the /sources end-point of a view service
 */
export interface IViewServiceSources {
  currentVersion: number;
  services: IViewServiceSource[];
}

/**
 * `IFeatureServiceDefinition` can also be imported from the following packages:
 *
 * ```js
 * import { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-service";
 * ```
 */
export interface IFeatureServiceDefinition {
  currentVersion?: number;
  serviceDescription: string;
  hasVersionedData: boolean;
  supportsDisconnectedEditing: boolean;
  supportsReturnDeleteResults: boolean;
  /** Boolean value indicating whether data changes. True if it does not. */
  hasStaticData?: boolean;
  /** Numeric value indicating tbe maximum number of records that will be returned at once for a query. */
  maxRecordCount: number;
  /** String value indicating the output formats that are supported in a query. */
  supportedQueryFormats: string;
  supportsRelationshipsResource: boolean;
  /** A comma separated list of supported capabilities, e.g. Query,Editing. */
  capabilities: string;
  /** String value of the layer as defined in the map service. */
  description: string;
  /** String value for the copyright text information for the layer. */
  copyrightText: string;
  advancedEditingCapabilities: { [key: string]: boolean };
  /** An object containing the WKID or WKT identifying the spatial reference of the layer's geometry. */
  spatialReference: ISpatialReference;
  initialExtent: IExtent;
  fullExtent: IExtent;
  /** Boolean value indicating whether the geometry of the features in the layer can be edited. */
  allowGeometryUpdates: boolean;
  units: string;
  syncEnabled: boolean;
  returnServiceEditsHaveSR?: boolean;
  validationSystemLayers: {
    validationPointErrorlayerId: number;
    validationLineErrorlayerId: number;
    validationPolygonErrorlayerId: number;
    validationObjectErrortableId: number;
  };
  extractChangesCapabilities: {
    supportsReturnIdsOnly: boolean;
    supportsReturnExtentOnly: boolean;
    supportsReturnAttachments: boolean;
    supportsLayerQueries: boolean;
    supportsSpatialFilter: boolean;
    supportsReturnFeature: boolean;
  };
  syncCapabilities: {
    supportsASync: boolean;
    supportsRegisteringExistingData: boolean;
    supportsSyncDirectionControl: boolean;
    supportsPerLayerSync: boolean;
    supportsPerReplicaSync: boolean;
    supportsRollbackOnFailure: boolean;
    supportedSyncDataOptions: number;
  };
  editorTrackingInfo: {
    enableEditorTracking: boolean;
    enableOwnershipAccessControl: boolean;
    allowOthersToUpdate: boolean;
    allowOthersToDelete: boolean;
  };
  documentInfo?: { [key: string]: string };
  // the feature layers published by this service
  layers: ILayerDefinition[];
  // the non-spatial tables published by this service
  tables: ITable[];
  relationships: [
    {
      id: number;
      name: string;
      backwardPathLabel: string;
      originLayerId: number;
      originPrimaryKey: string;
      forwardPathLabel: string;
      destinationLayerId: number;
      originForeignKey: string;
      relationshipTableId: number;
      destinationPrimaryKey: string;
      destinationForeignKey: string;
      rules: [
        {
          ruleID: number;
          originSubtypeCode: number;
          originMinimumCardinality: number;
          originMaximumCardinality: number;
          destinationSubtypeCode: number;
          destinationMinimumCardinality: number;
          destinationMaximumCardinality: number;
        }
      ];
      cardinality:
        | "esriRelCardinalityOneToOne"
        | "esriRelCardinalityOneToMany"
        | "esriRelCardinalityManyToMany";
      attributed: boolean;
      composite: boolean;
    }
  ];
  enableZDefaults?: boolean;
  isLocationTrackingService: boolean;
  isLocationTrackingView: boolean;
  zDefault?: number;
}

/**
 * Root element in the web map specifying an array of table objects.
 */
export interface ITable {
  /** Table name */
  name?: string;
  /** A comma-separated string listing which editing operations are allowed on an editable feature service. Available operations include: 'Create', 'Delete', 'Query', 'Update', and 'Editing'. */
  capabilities?: string;
  /** Object indicating the definitionEditor used as a layer's interactive filter. */
  definitionEditor?: IDefinitionEditor;
  /** Unique identifier for the table. */
  id?: number;
  /** Unique string value indicating an item registered in ArcGIS Online or your organization's portal. */
  itemId?: string;
  /** A layerDefinition object defining a definition expression for the table. */
  layerDefinition?: ILayerDefinition;
  /** An object defining the content of popup windows when you query a record and the sort option for child related records. */
  popupInfo?: IPopupInfo;
  /** String value for the title of the table. */
  title?: string;
  /** String value indicating the URL reference of the hosted table. */
  url?: string;
}

export interface IDefinitionParameter {
  /** The default value that is automatically given if nothing is provided. */
  defaultValue?: number | string;
  /** A string value representing the name of the field to query. */
  fieldName?: string;
  /** Number given to uniquely identify the specified parameter. */
  parameterId?: any;
  /** The field type for the specified field parameter. */
  type?:
    | "esriFieldTypeBlob"
    | "esriFieldTypeDate"
    | "esriFieldTypeDouble"
    | "esriFieldTypeGeometry"
    | "esriFieldTypeGlobalID"
    | "esriFieldTypeGUID"
    | "esriFieldTypeInteger"
    | "esriFieldTypeOID"
    | "esriFieldTypeRaster"
    | "esriFieldTypeSingle"
    | "esriFieldTypeSmallInteger"
    | "esriFieldTypeString"
    | "esriFieldTypeXML";

  /** An integer value representing exact UNIX time used when defaultValue is a date string. */
  utcValue?: number;
}

export interface IDefinitionInput {
  /** A string value representing a hint for the input. */
  hint?: string;
  /** An array of parameter objects. */
  parameters?: IDefinitionParameter[];
  /** A string value representing the prompt for the input. */
  prompt?: string;
}

/**
 * The definitionEditor stores interactive filters at the same level as layerDefinition.
 */
export interface IDefinitionEditor {
  /** An array of input objects. */
  inputs?: IDefinitionInput[];
  /** A string value representing the where clause for the interactive filter. */
  parameterizedExpression?: string;
}

/**
 * Arcade expression added to the pop-up.
 */
export interface IPopupExpressionInfo {
  /** The Arcade expression. */
  expression?: string;
  /** Unique identifier for the expression. */
  name?: string;
  /** Return type of the Arcade expression, can be number or string. Defaults to string value. Number values are assumed to be double. This can be determined by the authoring client by executing the expression using a sample feature(s), although it can be corrected by the user. Knowing the returnType allows the authoring client to present fields in relevant contexts. For example, numeric fields in numeric contexts such as charts. */
  returnType?: "number" | "string";
  /** Title of the expression. */
  title?: string;
}

/**
 * The format object can be used with numerical or date fields to provide more detail about how values should be displayed in popup windows.
 */
export interface IFieldFormat {
  /** A string used with date fields to specify how the date should appear in popup windows. */
  dateFormat?:
    | "shortDate"
    | "shortDateLE"
    | "longMonthDayYear"
    | "dayShortMonthYear"
    | "longDate"
    | "shortDateShortTime"
    | "shortDateLEShortTime"
    | "shortDateShortTime24"
    | "shortDateLEShortTime24"
    | "shortDateLongTime"
    | "shortDateLELongTime"
    | "shortDateLongTime24"
    | "shortDateLELongTime24"
    | "longMonthYear"
    | "shortMonthYear"
    | "year";

  /**
   * A Boolean used with numerical fields. A value of true allows the number to have a digit (or thousands) separator when the value appears in popup windows.
   * Depending on the locale, this separator is a decimal point or a comma. A value of false means that no separator will be used.
   */
  digitSeparator?: boolean;
  /**
   * An integer used with numerical fields to specify the number of supported decimal places that should appear in popup windows. Any places beyond this value are rounded.
   */
  places?: number;
}

/**
 * Defines how a field in the dataset participates (or does not participate) in a popup window.
 */
export interface IFieldInfo {
  /** A string containing the field name as defined by the service. Anywhere that a fieldname is referenced as {field-name} in popupInfo, an Arcade expression can also be referenced as{expression/}`. */
  fieldName?: any;
  /** A format object used with numerical or date fields to provide more detail about how the value should be displayed in a web map popup window. */
  format?: IFieldFormat;
  /** A Boolean determining whether users can edit this field. Not applicable to Arcade expressions. */
  isEditable?: boolean;
  /** A string containing the field alias. This can be overridden by the web map author. Not applicable to Arcade expressions as title is used instead. */
  label?: string;
  /** A string determining what type of input box editors see when editing the field. Applies only to string fields. Not applicable to Arcade expressions. */
  stringFieldOption?: "textbox" | "textarea" | "richtext";

  /** A string providing an editing hint for editors of the field. Not applicable to Arcade expressions. */
  tooltip?: string;
  /** A Boolean determining whether the field is visible in the popup window. */
  visible?: boolean;
}

/**
 * Defines the look and feel of popup windows when a user clicks or queries a feature.
 */
export interface IPopupInfo {
  /** A string that appears in the body of the popup window as a description. It is also possible to specify the description as HTML-formatted content. */
  description?: string | null;
  /** List of Arcade expressions added to the pop-up. */
  expressionInfos?: IPopupExpressionInfo[];
  /** Array of fieldInfo information properties. This information is provided by the service layer definition. When the description uses name/value pairs, the order of the array is how the fields display in the editable Map Viewer popup and the resulting popup. It is also possible to specify HTML-formatted content. */
  fieldInfos?: IFieldInfo[];
  /** Additional options that can be defined for the popup layer. */
  layerOptions?: {
    /** Indicates whether or not the NoData records should be displayed. */
    showNoDataRecords: boolean;
  };
  /** Array of various mediaInfo to display. Can be of type image, piechart, barchart, columnchart, or linechart. The order given is the order in which is displays. */
  mediaInfos?: IMediaInfo[];
  /** An array of popupElement objects that represent an ordered list of popup elements. */
  popupElements?: IPopupElement[];
  /** Indicates whether to enable related records if they exist on a layer. */
  relatedRecordsInfo?: IRelatedRecordsInfo;
  /** Indicates whether attachments will be loaded for feature layers that have attachments. */
  showAttachments?: boolean;
  /** A string that appears at the top of the popup window as a title. */
  title?: string;
}

/**
 * The sort in the popupInfo for the parent feature. This impacts the sorting order for the returned child records.
 */
export interface IRelatedRecordsInfo {
  /** Array of orderByFields objects indicating the field display order for the related records and whether they should be sorted in ascending 'asc' or descending 'desc' order. */
  orderByFields?: IOrderByField[];
  /** Required boolean value indicating whether to display related records. If true, client should let the user navigate to the related records. Defaults to true if the layer participates in a relationship AND the related layer/table has already been added to the map (either as an operationalLayer or as a table). */
  showRelatedRecords: boolean;
}

/**
 * Object indicating the field display order for the related records and whether they should be sorted in ascending or descending order.
 */
export interface IOrderByField {
  /** The attribute value of the field selected that will drive the sorting of related records. */
  field?: string;
  /** Set the ascending or descending sort order of the returned related records. */
  order?: "asc" | "desc";
}

/**
 * The value object contains information for popup windows about how images should be retrieved or charts constructed.
 */
export interface IMediaInfoValue {
  /** Used with charts. An array of strings, with each string containing the name of a field to display in the chart. */
  fields?: string[];
  /** Used with images. A string containing a URL to be launched in a browser when a user clicks the image. */
  linkURL?: string;
  /** Used with charts. An optional string containing the name of a field. The values of all fields in the chart will be normalized (divided) by the value of this field. */
  normalizeField?: string;
  /** Used with images. A string containing the URL to the image. */
  sourceURL?: string;
  /** String value indicating the tooltip for a chart specified from another field. This field is needed when related records are not sued. It is used for showing tooltips from another field in the same layer or related layer/table. */
  tooltipField?: string;
}

/**
 * Defines an image or a chart to be displayed in a popup window.
 */
export interface IMediaInfo {
  /** A string caption describing the media. */
  caption?: any;
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. If the property does not exist, it's equivalent to having a value of 0. Only applicable when type is set to image. */
  refreshInterval?: any;
  /** A string title for the media. */
  title?: string | null;
  /** A string defining the type of media. */
  type?: "image" | "barchart" | "columnchart" | "linechart" | "piechart";

  /** A value object containing information about how the image should be retrieved or how the chart should be constructed. */
  value?: IMediaInfoValue | null;
}

/**
 * Popup elements allow users to author popups, using multiple elements such as tabular views, string description, media (charts and images), and attachments of the attributes
 * and control the order in which they appear. Specifically, popupElements do the following:
 * 1) provide the ability to explicitly add a field/ value table in addition to a description,
 * 2) allow adding multiple description elements, and
 * 3) allow a user to author and consume elements of a popup in the order of their choosing.
 */
export interface IPopupElement {
  /**
   * This property applies to elements of type attachments. A string value indicating how to display the attachment.
   * Possible values are, preview, and list. If list is specified, attachments show as links.
   */
  displayType?: "preview" | "list";
  /**
   * This property applies to elements of type fields. It is an array of popupInfo.fieldInfo objects representing a field/value pair displayed as a table within the popupElement.
   * If the fieldInfos property is not provided, the popupElement will display whatever is specified directly in the popupInfo.fieldInfos property.
   */
  fieldInfos?: IFieldInfo[];
  /**
   * This property applies to elements of type media. An array of popupInfo.mediaInfo objects representing an image or chart for display.
   * If no mediaInfos property is provided, the popupElement will display whatever is specified in the popupInfo.mediaInfo property.
   */
  mediaInfos?: IMediaInfo[];
  /**
   * This property applies to elements of type text. This is string value indicating the text to be displayed within the popupElement.
   * If no text property is provided, the popupElement will display whatever is specified in the popupInfo.description property.
   */
  text?: string;
  /** String value indicating which elements to use. */
  type?: "text" | "fields" | "media" | "attachments";
}

export interface IEditingInfo {
  /** date of last edit to the layer  */
  lastEditDate?: number;
}

export type FeatureEditTool =
  | "esriFeatureEditToolAutoCompletePolygon"
  | "esriFeatureEditToolPolygon"
  | "esriFeatureEditToolTriangle"
  | "esriFeatureEditToolRectangle"
  | "esriFeatureEditToolLeftArrow"
  | "esriFeatureEditToolRightArrow"
  | "esriFeatureEditToolEllipse"
  | "esriFeatureEditToolUpArrow"
  | "esriFeatureEditToolDownArrow"
  | "esriFeatureEditToolCircle"
  | "esriFeatureEditToolFreehand"
  | "esriFeatureEditToolLine"
  | "esriFeatureEditToolNone"
  | "esriFeatureEditToolText"
  | "esriFeatureEditToolPoint";

/**
 * Templates describe features that can be created in a layer. They are generally used with feature collections and editable web-based CSV layers.
 * Templates are not used with ArcGIS feature services as these already have templates defined in the service. They are also defined as properties
 * of the layer definition when there are no defined types. Otherwise, templates are defined as properties of the types.
 */
export interface ITemplate {
  /** A string value containing a detailed description of the template. */
  description?: any;
  /**
   * An optional string that can define a client-side drawing tool to be used with this feature. For example, map notes used by the Online Map Viewer use this to represent the viewer's different drawing tools.
   */
  drawingTool?: FeatureEditTool;
  /** A string containing a user-friendly name for the template. */
  name?: string;
  /** A feature object representing a prototypical feature for the template. */
  prototype?: IFeature;
}

export interface ILayerDefinition extends IHasZM {
  /** Boolean value indicating whether the geometry of the features in the layer can be edited. */
  allowGeometryUpdates?: boolean;
  /** A comma separated list of supported capabilities, e.g. Query,Editing. */
  capabilities?: string;
  /** String value for the copyright text information for the layer. */
  copyrightText?: string;
  /** Numeric value indicating the server version of the layer. */
  currentVersion?: number;
  /** Boolean value indicating whether the layer's visibility is turned on. */
  defaultVisibility?: boolean;
  /** Stores interactive filters. */
  definitionEditor?: IDefinitionEditor;
  /** SQL-based definition expression string that narrows the data to be displayed in the layer. */
  definitionExpression?: string;
  /** String value of the layer as defined in the map service. */
  description?: string;
  /** A string value that summarizes the feature. */
  displayField?: string;
  /** Contains drawing, labeling, and transparency information. */
  drawingInfo?: any;
  /** An object defining the rectangular area. */
  extent?: IExtent | null;
  /** An object defining the editing info (last edit date). */
  editingInfo?: IEditingInfo;
  /** Feature reductions declutter the screen by hiding features that would otherwise intersect with other features on screen. */
  featureReduction?: any;
  /** An array of field objects containing information about the attribute fields for the feature collection or layer. */
  fields?: IField[];
  /** A string defining the type of geometry. Possible geometry types are: esriGeometryPoint, esriGeometryMultipoint, esriGeometryPolyline, esriGeometryPolygon, and esriGeometryEnvelope. */
  geometryType?: GeometryType;
  /** The unique identifier for a feature or table row within a geodatabase. */
  globalIdField?: string;
  /** Indicates whether attachments should be loaded for the layer. */
  hasAttachments?: boolean;
  /** Boolean value indicating whether data changes. True if it does not. */
  hasStaticData?: boolean;
  /** String value indicating the HTML popup type. */
  htmlPopupType?:
    | "esriServerHTMLPopupTypeNone"
    | "esriServerHTMLPopupTypeAsURL"
    | "esriServerHTMLPopupTypeAsHTMLText";

  /** The identifier assigned to the layer. */
  id?: number;
  /** Boolean value indicating whether the data is versioned. */
  isDataVersioned?: boolean;
  /** Numeric value indicating tbe maximum number of records that will be returned at once for a query. */
  maxRecordCount?: number;
  /** Represents the maximum scale at which the layer definition will be applied. This does not apply to layers of type: ArcGISMapServiceLayer, ImageServiceVectorLayer or ImageServiceLayer. */
  maxScale?: number;
  /** Represents the minimum scale at which the layer definition will be applied. This does not apply to layers of type: ArcGISMapServiceLayer, ImageServiceVectorLayer or ImageServiceLayer. */
  minScale?: number;
  /** Contains a unique name for the layer that can be displayed in a legend. */
  name?: string;
  /** Indicates the name of the object ID field in the dataset. */
  objectIdField?: string;
  /** Dictates whether a client can support having an end user modify symbols on individual features. */
  overrideSymbols?: boolean;
  /** Indicates range information */
  rangeInfos?: any;
  /** An object indicating the layerDefinition's layer source. */
  source?: any;
  /** An object containing the WKID or WKT identifying the spatial reference of the layer's geometry. */
  spatialReference?: ISpatialReference;
  /** String value indicating the output formats that are supported in a query. */
  supportedQueryFormats?: string;
  /** Boolean value indicating whether the layer supports orderByFields in a query operation. */
  supportsAdvancedQueries?: boolean;
  /** Boolean value indicating whether the layer supports uploading attachments with the Uploads operation. This can then be used in the Add Attachment and Update Attachment operations. */
  supportsAttachmentsByUploadId?: boolean;
  /** Boolean value indicating whether the layer supports the Calculate REST operation when updating features. */
  supportsCalculate?: boolean;
  /** Boolean value indicating whether the layer supports exceedsLimit in a query operation. */
  supportsExceedsLimitStatistics?: boolean;
  /** Boolean value indicating whether the layer supports rolling back edits made on a feature layer if some of the edits fail. */
  supportsRollbackOnFailureParameter?: boolean;
  /** Boolean value indicating whether feature layer query operations support statistical functions. */
  supportsStatistics?: boolean;
  /** Boolean value indicating whether the validateSQL operation is supported across a feature service layer. */
  supportsValidateSql?: boolean;
  /** A property of the layer definition when there are no types defined; otherwise, templates are defined as properties of the types. */
  templates?: ITemplate[];
  /** The time info metadata of the layer. May be set for feature layers inside a feature collection item. */
  timeInfo?: any;
  /** Indicates whether the layerDefinition applies to a Feature Layer or a Table. */
  type?: "Feature Layer" | "Table";
  /** Contains the name of the field holding the type ID for the features. */
  typeIdField?: string;
  /** Contains information about an attribute field. */
  types?: any;
  /** String value indicating the attribute field that is used to control the visibility of a feature.
   * If applicable, when rendering a feature the client should use this field to control visibility.
   * The field's values are 0 = do not display, 1 = display.
   */
  visibilityField?: string;
  relationships?: any[];
  editFieldsInfo?: {
    creationDateField?: string;
    creatorField?: string;
    editDateField?: string;
    editorField?: string;
  };
  parentLayerId?: number;
  ownershipBasedAccessControlForFeatures?: boolean;
  syncCanReturnChanges?: boolean;
  archivingInfo?: {
    supportsQueryWithHistoricMoment?: boolean;
    startArchivingMoment?: number;
  };
  supportsValidateSQL?: boolean;
  advancedQueryCapabilities?: {
    supportsPagination?: boolean;
    supportsTrueCurve?: boolean;
    supportsQueryWithDistance?: boolean;
    supportsReturningQueryExtent?: boolean;
    supportsStatistics?: boolean;
    supportsOrderBy?: boolean;
    supportsDistinct?: boolean;
    supportsSqlExpression?: boolean;
    supportsPercentileStatistics?: boolean;
  };
  allowTrueCurvesUpdates?: boolean;
  onlyAllowTrueCurveUpdatesByTrueCurveClients?: boolean;
  supportsApplyEditsWithGlobalIds?: boolean;
  subtypeField?: string;
  indexes?: any[];
  dateFieldsTimeReference?: {
    timeZone?: string;
    respectsDaylightSaving?: boolean;
  };
  useStandardizedQueries?: boolean;
}
