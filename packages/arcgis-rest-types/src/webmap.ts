/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IExtent,
  ISpatialReference,
  GeometryType,
  IHasZM,
  IGeometry,
  IPoint
} from "./geometry";

import { IFeature, IFeatureSet } from "./feature";

import {
  ISimpleLineSymbol,
  IPictureMarkerSymbol,
  ISimpleFillSymbol,
  Color
} from "./symbol";

/**
 * Field type.
 */
export type FieldType =
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

/**
 * Domain types
 */
export type DomainType = 
 | "range"
 | "codedValue"
 | "inherited";

/**
 * CodedValue type
 */
export type ICodedValue = {
  /**  User-friendly name for what the code means. */
  name: string;
  /**  The value stored in the feature attribute. */
  code: string | number;
}

/**
 * Information for a field with a domain
 */
export type IDomain = {
  /** A string defining the domain type. */
  type: DomainType;
  /** A string defining the field name. */
  name?: string;
  /** A 2 element array defining the range of possible values. */
  range?: [number, number];
  /** An array of CodedValues for domains of type codedValue. */
  codedValues?: ICodedValue[];
  /** Description of the domain */
  description?: string,
  /** Merge policy */
  mergePolicy?: string,
  /** Split Policy */
  splitPolicy?: string
}

/**
 * Contains information about an attribute field.
 *
 * `IField` can also be imported from the following packages:
 *
 * ```js
 * import { IField } from "@esri/arcgis-rest-feature-layer";
 * ```
 */
export interface IField {
  /** A string defining the field name. */
  name: string;
  /** A string defining the field type. */
  type: FieldType;
  /** A string defining the field alias. */
  alias?: string;
  /** The domain objects if applicable. */
  domain?: IDomain;
  /** A Boolean defining whether this field is editable. */
  editable?: boolean;
  /** A Boolean defining whether or not the field is an exact match. */
  exactMatch?: boolean;
  /** A number defining how many characters are allowed in a string. field. */
  length?: number;
  /** A Boolean defining whether this field can have a null value. */
  nullable?: boolean;
  /** The value written in for new records by default. */
  defaultValue?: any;
}

/**
 * Params for paging operations
 *
 * `IPagingParams` can also be imported from the following packages:
 *
 * ```js
 * import { IPagingParams } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IPagingParams {
  start?: number;
  num?: number;
}
/**
 * Paging properties for paged responses.
 *
 * `IPagedResponse` can also be imported from the following packages:
 *
 * ```js
 * import { IPagedResponse } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IPagedResponse extends IPagingParams {
  /** total number of object across all pages */
  total: number;
  /** next entry index or -1 for the last page */
  nextStart: number;
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
 * The sort in the popupInfo for the parent feature. This impacts the sorting order for the returned child records.
 */
export interface IRelatedRecordsInfo {
  /** Array of orderByFields objects indicating the field display order for the related records and whether they should be sorted in ascending 'asc' or descending 'desc' order. */
  orderByFields?: IOrderByField[];
  /** Required boolean value indicating whether to display related records. If true, client should let the user navigate to the related records. Defaults to true if the layer participates in a relationship AND the related layer/table has already been added to the map (either as an operationalLayer or as a table). */
  showRelatedRecords: boolean;
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
 * Defines the appearance for the background of the map.
 * @example
 * { "background": { "color": [255,255,255,255] } }
 */
export interface IWebMapBackground {
  /**
   * To define the color of the background of the map (which is shown when no data is shown).
   */
  color: Color;
}

/**
 * Predefined bookmarks for use by the application. A bookmark is a saved map extent that allows end users to quickly navigate to a particular area of interest.
 */
export interface IBookmark {
  /** An extent object containing a spatial reference, a lower left coordinate, and an upper right coordinate defining the rectangular area of the bookmark. The spatial reference must be the same as the map spatial reference. Documentation for the envelope is in the Geometry Objects topic of the ArcGIS REST API help. */
  extent: IExtent;
  /** A string name for the bookmark. */
  name: string;
}

/**
 * Map range information
 * @example
 * {
 *   "mapRangeInfo": {
 *     "activeRangeName": "floors",
 *     "currentRangeExtent": [ -2, 10 ],
 *     "fullRangeExtent": [-2, 100 ]
 *   }
 * }
 */
export interface IMapRangeInfo {
  /** Active range ID that slider/picker acts upon. */
  activeRangeName?: string;
  /** Current range for the active range. */
  currentRangeExtent?: number[];
  /** Full range extent for the active range to be presented in the UI. */
  fullRangeExtent?: number[];
}

/**
 * Contains location information within a presentation slide.
 * @see https://developers.arcgis.com/web-map-specification/objects/mapLocation/
 */
export interface IMapLocation {
  /** The center of the map specified using X/Y coordinates. */
  centerPoint: IPoint;
  /** Well-known ID (WKID) or well-known text (WKT). */
  spatialReference: ISpatialReference;
}

/**
 * An array of numbers indicating layer visibility.
 * @example
 * {
 *   "visibleLayer": {
 *     "featureVisibility": [
 *       [ 1 ],
 *       [],
 *       [],
 *       [ 0 ]
 *     ],
 *     "id": "73128eb3-05ee-46a7-8c22-0c385a0b1827"
 *   }
 * }
 */
export interface IVisibleLayer {
  /** An array of arrays. */
  featureVisibility?: any[][];
  /** The id of the layer as listed on the operational layer. */
  id?: number;
  /** An array of integers. */
  subLayerIds?: number[];
}

/**
 * A presentation slide's visiblePopup which contains anchorPoint, featureId, layerId, and subLayerId.
 * @see https://developers.arcgis.com/web-map-specification/objects/visiblePopup/
 */
export interface IVisiblePopup {
  /** Object with spatialReference, x, and y. */
  anchorPoint?: IPoint;
  /** An integer specifying the feature's id. */
  featureId?: number;
  /** A string specifying the layer id. */
  layerId?: string;
  /** An integer specifying the sublayer id. */
  subLayerId?: number;
}

export interface ISlide {
  /** Basemaps give the web map a geographic context. */
  baseMap?: IBaseMap;
  /** The standard Esri extent object with spatialReference, xmax, xmin, ymax and ymin. */
  extent?: IExtent;
  /** Indicates whether the slide should be hidden within the presentation. */
  hidden?: boolean;
  /** An object with a centerPoint object and sometimes a resolution. */
  mapLocation?: IMapLocation;
  /** An array of two numbers. The first one indicates start time and the second one indicates end time. */
  timeExtent?: [number, number];
  /** Title including text and formatting for each slide. */
  title?: string;
  /** An array of objects used to indicate layer visibility. */
  visibleLayers?: IVisibleLayer;
  /** A presentation slide's visiblePopup which contains anchorPoint, featureId, layerId, and subLayerId. */
  visiblePopup?: IVisiblePopup;
}

export interface IPresentation {
  /** Indicates whether to display the time slider (if accessible). */
  displayTimeSlider?: boolean;
  /** Indicates whether to display a legend on all slides. */
  showLegend?: boolean;
  /** Number of seconds to show slide before proceeding to the next slide. */
  slideAdvancementInterval?: number;
  /** Array of slide objects. */
  slides?: ISlide[];
  /** Indicates whether to use the time extent (if applicable) of a slide. */
  useTimeExtentOfSlide?: boolean;
}

/**
 * Root element in the web map specifying an array of table objects.
 *
 * `ITable` can also be imported from the following packages:
 *
 * ```js
 * import { ITable } from "@esri-arcgis-rest-service-admin"
 * ```
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

/**
 * The web map data lists the basemap, operational layers, and bookmarks to be used in the web map.
 * It also contains information about popup windows and layer styling overrides to be used in the web map.
 * A version property allows you to supply the version of the web map JSON format being used.
 */
export interface IWebmap {
  /** Viewing and editing properties of the webmap */
  applicationProperties?: IApplicationProperties;
  /** String value indicating the application which authored the webmap */
  authoringApp?: string;
  /** String value indicating the authoring App's version number */
  authoringAppVersion?: string;
  /** Defines the appearance for the background of the map. */
  background?: IWebMapBackground;
  /** [Required] Basemaps give the web map a geographic context */
  baseMap: IBaseMap;
  /** A bookmark is a saved geographic extent that allows end users to quickly navigate to a particular area of interest */
  bookmarks?: IBookmark[];
  /** Map Range Information */
  mapRangeInfo?: IMapRangeInfo;
  /** Operational layers contain business data which are used to make thematic maps */
  operationalLayers?: ILayer[];
  /** A presentation consists of multiple slides. Each slide has a different title, extent, basemap, layers etc */
  presentation?: any;
  /** [Required] An object used to specify the spatial reference of the given geometry. */
  spatialReference: ISpatialReference;
  /** Root element in the web map specifying an array of table objects. (optional) */
  tables?: ITable[];
  /** [Required] Root element in the web map specifying a string value indicating the web map version. */
  version: string;
  /** The widgets object contains widgets that should be exposed to the user */
  widgets?: any;
}

/**
 * Range object.
 * @see https://developers.arcgis.com/web-map-specification/objects/range/
 */
export interface IRange {
  /** Indicates the mode in which the active range should be presented to the user. Must be one of the following values:    slider,    picker */
  interactionMode?: "slider" | "picker";

  /** This is used to generate the activeRangeValues if activeRangeValues are not specified. */
  numberOfStops?: any;
  /** Interval in which stops should be generated. */
  stopInterval?: number;
}

/**
 * The widgets object contains widgets that should be exposed to the user.
 */
export interface IWidget {
  /** Active range. */
  range?: IRange;
  /** Time animation is controlled by a configurable time slider. The time slider widget will act upon all the time aware layers in the map. */
  timeSlider?: ITimeSliderProperties;
}

/**
 * Configurable properties used within the TimeSlider widget.
 */
export interface ITimeSliderProperties {
  /** An optional array of numbers indicating the slider's start to end time extent. */
  currentTimeExtent?: number[];
  /** The optional end of the time slider. If not specified, the slider defaults to the full time extent of all time-enabled layers. */
  endTime?: number;
  /** Number of stops within the timeSlider widget. */
  numberOfStops?: number;
  /** The optional start of the time slider. If not specified, the slider defaults to the full time extent of all time-enabled layers. */
  startTime?: number;
  /** The default value for the thumbCount is 1. */
  thumbCount?: number;
  /** Rate at which the time animation plays. Units are in milliseconds. Default is 1000. */
  thumbMovingRate?: number;
  /** The interval which has been defined for the time slider. */
  timeStopInterval?: number;
}

/**
 * Time animation is controlled by a configurable time slider. Those configurations are saved to the web map as a timeSlider widget.
 */
export interface ITimeSlider {
  /**
   * Configurable properties used within the TimeSlider widget.
   */
  properties: ITimeSliderProperties;
}

/**
 * The applicationProperties object is one of the objects at the top level of the JSON web map JSON schema. This is responsible for containing the viewing and editing properties of the web map. There are specific objects within this object that are applicable only to Collector and are explained within the property descriptions.
 */
export interface IApplicationProperties {
  /** If locationTracking is set and enabled, the Collector application will update the feature service at the defined interval with the current location of the user logged into the Collector app. */
  editing?: IEditingProperties | null;
  /** Use if working with offline maps. */
  offline?: IOfflineInfo | null;
  /** An object containing all the viewing properties of the web map. If this is null or not defined, the client should assume a logical default. */
  viewing?: IViewingInfo | null;
}

/**
 * An object containing all the editing properties within the web map.
 */
export interface IEditingProperties {
  /**
   * If locationTracking is set and enabled, the collector app will update the feature service at the defined interval with the current location of the user logged into the collector application.
   */
  locationTracking: ILocationTracking;
}

/**
 * If locationTracking is set and enabled, the collector app will update the feature service at the defined interval with the current location of the user logged into the collector application.
 */
export interface ILocationTracking {
  /** A boolean value indicating whether or not location tracking is enabled on the webmap. */
  enabled: boolean;
  /** An object of additional information specifying layer and update interval time. */
  info: ILocationTrackingInfo;
}

/**
 * An object containing additional information specifying layer and update interval time used in the locationTracking object.
 */
export interface ILocationTrackingInfo {
  /** A string value indicating the given layer id specified in the web map. */
  layerId: any;
  /** A numeric value indicating the time interval used to update the feature service. Default value is 300 seconds. */
  updateInterval?: any;
}

/**
 * Use if working with offline maps.
 */
export interface IOfflineInfo {
  /** Object detailing the available offline editing options. */
  editableLayers: IEditableLayers;
  /** Object indicating what to do with attachments in read-only layers. */
  readonlyLayers: IReadOnlyLayers;
}

/**
 * Object detailing the available offline editing options.
 */
export interface IEditableLayers {
  /**
   * When editing layers, the edits are always sent to the server. This string value indicates which data is retrieved.
   * For example, none indicates that only the schema is written since neither the features nor attachments are retrieved.
   * For a full sync without downloading attachments, indicate features. Lastly, the default behavior is to have a full
   * sync using featuresAndAttachments where both features and attachments are retrieved.
   */
  download: "none" | "featuresAndAttachments" | "featuers";
  /** This string value indicates how the data is synced. */
  sync:
    | "uploadFeaturesAndAttachments"
    | "syncFeaturesAndAttachments"
    | "syncFeaturesUploadAttachments";
}

/**
 * Read-only layers as the features are always retrieved from the server.
 */
export interface IReadOnlyLayers {
  /** Indicates whether to include attachments with the read-only data. */
  downloadAttachments: boolean;
}

export interface IEnableable {
  enabled: boolean;
}

/**
 * An object specifying the search parameters set within the web map.
 */
export interface ISearch extends IEnableable {
  /** A boolean value indicating whether or not to disable the place finder. */
  disablePlaceFinder?: any;
  /** A string value used to indicate the hint provided with the search dialog. */
  hintText?: any;
  /** An array of layer objects defining the styling, geometry, and attribute information for the features. */
  layers?: any;
}

/**
 * An object containing all the viewing properties of the web map. If this is null or not defined, the client should assume a logical default.
 */
export interface IViewingInfo {
  /** The basemap tool which will use the basemap group defined in the Portal. */
  basemapGallery?: IEnableable;
  /** Measure tool. */
  measure?: IEnableable;
  /** The route tool which will leverage the Portals defined route service. */
  routing?: IEnableable;
  /** An object specifying search parameters within the webmap. */
  search?: ISearch;
}

/**
 * A basemap layer is a layer that provides geographic context to the map. A web map always contains a basemap.
 * The basemap has a title and is the combination of each baseMapLayer.
 * It is required that a baseMap be saved within the web map.
 */
export interface IBaseMap {
  /** An array of baseMapLayer objects defining the basemaps used in the web map. */
  baseMapLayers: ILayer[];
  /** Required string title for the basemap that can be used in a table of contents. It takes the title of the first baseMapLayer in the array. */
  title: string;
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

export interface ISupportsTime {
  /** This property is applicable to layers that support time. If 'true', timeAnimation is enabled. */
  timeAnimation?: boolean;
}

export interface IBingLayer extends ILayer {
  /** String value that unlocks the use of Bing layers in a web map. */
  bingKey?: string;
  /** Boolean value indicating whether the Bing key can be shared to the public. */
  canShareBingPublic?: boolean;
  /** String indicating the layer type. */
  layerType: "BingMapsAerial" | "BingMapsRoad" | "BingMapsHybrid";
  /** A string value representing the URL to the Portal/organization Self resource. Calls should be made to this property to retrieve the Bing key. If the key is not made accessible to the public or if canShareBingPublic is false, any web maps using Bing layers will not work. */
  portalUrl?: string;
}

export interface IImageServiceLayer extends ILayer, ISupportsTime {
  /** An array of bandIds that are visible, can specify bands to export or rearrange band order(from image service). */
  bandIds?: number[];
  /** Controls how much loss the image will be subjected to by the compression algorithm (from image service). */
  compressionQuality?: any;
  /** Stores interactive filters. */
  definitionEditor?: any;
  /** Boolean property indicating whether to ignore popups defined by the service item. */
  disablePopup?: boolean;
  /** String value representing image format. */
  format?:
    | "jpgpng"
    | "png"
    | "png8"
    | "png24"
    | "jpg"
    | "bmp"
    | "gif"
    | "tiff"
    | "png32";

  /** The algorithm used for interpolation. */
  interpolation?:
    | "RSP_BilinearInterpolation"
    | "RSP_CubicConvolution"
    | "RSP_Majority"
    | "RSP_NearestNeighbor";

  /** This is applicable if used as a baseMapLayer. A boolean value indicating whether or not the baseMapLayer draws on top (true) of other layers, including operationalLayers , or below (false). */
  isReference?: boolean;
  /** A layerDefinition object defining the attribute schema and drawing information for the layer. */
  layerDefinition?: any;
  /** String indicating the layer type. Value of this property must be ArcGISImageServiceLayer */
  layerType: "ArcGISImageServiceLayer";
  /** Specifies the mosaic rule when defining how individual images should be mosaicked. */
  mosaicRule?: any;
  /** The pixel value that represents no information. */
  noData?: any;
  /** A string value of interpretation of noData setting. Default is 'esriNoDataMatchAny' when noData is a number, and 'esriNoDataMatchAll' when noData is an array. */
  noDataInterpretation?: "esriNoDataMatchAny" | "esriNoDataMatchAll";
  /** Pertains to the type of values stored in the raster, such as signed integer, unsigned integer, or floating point. */
  pixelType?:
    | "C128"
    | "C64"
    | "F32"
    | "F64"
    | "S16"
    | "S32"
    | "S8"
    | "U1"
    | "U16"
    | "U2"
    | "U32"
    | "U4"
    | "U8"
    | "UNKNOWN";

  /** A popupInfo object defining the content of popup windows when you click or query a feature. */
  popupInfo?: IPopupInfo;
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: number;
  /** Specifies the rendering rule for how the requested image should be rendered. */
  renderingRule?: any;
}

export interface IImageVectorLayer extends ILayer, ISupportsTime {
  /** Stores interactive filters. */
  definitionEditor?: any;
  /** Boolean property indicating whether to ignore popups defined by the service item. */
  disablePopup?: any;
  /** This is applicable if used as a baseMapLayer. A boolean value indicating whether or not the baseMapLayer draws on top (true) of other layers, including operationalLayers , or below (false). */
  isReference?: boolean;
  /** A layerDefinition object defining the attribute schema and drawing information for the layer. */
  layerDefinition?: any;
  /** String indicating the layer type. Value of this property must be ArcGISImageServiceVectorLayer */
  layerType: "ArcGISImageServiceVectorLayer";
  /** Specifies the mosaic rule when defining how individual images should be mosaicked. */
  mosaicRule?: any;
  /** A popupInfo object defining the content of popup windows when you click or query a feature. */
  popupInfo?: IPopupInfo;
  /** Number describing the size of the tile. */
  symbolTileSize?: any;
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
 * A layer object may allow overrides on popup content and drawing behavior for individual layers of a web service.
 * This object also contains geographic features and their attributes when used in a feature collection.
 */
export interface IChildLayer {
  /** Default visibility of the layers in the map service. */
  defaultVisibility?: any;
  /** An object that provides interactive filters. */
  definitionEditor?: IDefinitionEditor;
  /** A featureSet object containing the geometry and attributes of the features in the layer. Used with feature collections only. */
  featureSet?: IFeatureSet;
  /** Information about each field in a layer. Used with feature collections. */
  field?: IField[];
  /** A string indicating the index position of the layer in the map service or feature collection. */
  id?: string;
  /** The layerDefinition object defines the attribute schema and drawing information for the layer. */
  layerDefinition?: any;
  /** A string URL to a service that should be used for all queries against the layer. Used with hosted tiled map services on ArcGIS Online when there is an associated feature service that allows for queries. */
  layerUrl?: any;
  /** Represents the maximum scale at which the layer definition will be applied. */
  maxScale?: any;
  /** Represents the minimum scale at which the layer definition will be applied. */
  minScale?: any;
  /** Iterates within a featureset. Number objectId value is incremented +1 based on last Object ID defined for the feature in a featureset. Used with feature collections. */
  nextObjectId?: any;
  /** If working with nested layers, this is the numeric value indicating the layer id of the next layer (parent) directly above the current referenced layer. */
  parentLayerId?: any;
  /** A popupInfo object defining the popup window content for the layer. */
  popupInfo?: IPopupInfo;
  /** Indicates whether to allow map authors the ability to control what layers should be shown in a client's legend. */
  showLegend?: any;
  /** Array of numeric values indicating the layer index for layers nested directly under the parent layer. */
  subLayer?: any;
  /** If the layer is a parent layer, it will have one or more sub layers included in an array. */
  subLayerIds?: any;
  /** A user-friendly string title for the layer that can be used in a table of contents. */
  title?: any;
}

export interface IMapServiceLayer extends ILayer, ISupportsTime {
  /** This is applicable if used as a baseMapLayer. A boolean value indicating whether or not the baseMapLayer draws on top (true) of other layers, including operationalLayers , or below (false). */
  isReference?: any;
  /** String indicating the layer type. */
  layerType: "ArcGISMapServiceLayer";
  /** An array of layer objects defining the styling, geometry, and attribute information for the features. */
  layers?: IChildLayer[];
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: number;
  /** (Optional) A thematicGroup object used in ArcGISMapServiceLayer layers. */
  thematicGroup?: IThematicGroup;
  /** An array of sublayer ids that should appear visible. Used with map service layers that are not tiled. */
  visibleLayers?: number[];
}

export interface IThematicGroup {
  /** An array of string values indicating all the fields used within the webmap. All other fields can be disregarded and should not display in any field selection list. */
  fieldNames?: string[];
  /** A zero-based array of integers indicating the layers to be used in the webmap. NOTE: All other layers should not be added to the TOC and may or may not be visible on the map as reference layers. */
  layerIds?: number[];
  /** String property indicating the name for the thematic grouping of layers. */
  name?: string;
}

export interface IDrawingInfo {
  /** Only used for feature collections with a renderer. The feature's symbol is defined by the layer's renderer. */
  fixedSymbols?: any;
  /** An object defining the properties used for labeling the layer. */
  labelingInfo?: any;
  /** An object defined which provides the symbology for the layer. */
  renderer?: any;
  /** Boolean property indicating whether symbols should stay the same size in screen units as you zoom in. A value of true means the symbols stay the same size in screen units regardless of the map scale. */
  scaleSymbols?: any;
  /** Defines whether labels should be shown or not. This is only valid for sublayers. */
  showLabels?: boolean;
  /** Number value ranging between 0 (no transparency) to 100 (completely transparent). */
  transparency?: number;
}

export interface IEditingInfo {
  /** date of last edit to the layer  */
  lastEditDate?: number
}

/**
 * `ILayerDefinition` can also be imported from the following packages:
 *
 * ```js
 * import { ILayerDefinition } from "@esri/arcgis-rest-service-admin";
 * import { ILayerDefinition } from "@esri/arcgis-rest-feature-layer";
 * ```
 */
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

export interface ITypeInfoDomain {
  type: string | "inherited";
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

export interface ITypeInfo {
  /** A comma-delimited series of domain objects for each domain in the type. */
  domains?: {
    [domain: string]: ITypeInfoDomain;
  };
  /** A unique string or numerical ID for the type. */
  id?: string | number;
  /** A user-friendly name for the type. */
  name?: string;
  /** Defined as a property of the layer definition when there are no types defined; otherwise, templates are defined as properties of the types. */
  templates?: ITemplate[];
}

/**
 * Allows use of OpenStreetMap data for use in basemaps only.
 */
export interface IOpenStreetMapLayer extends ILayer {
  /** String indicating the layer type. Value of this property must be OpenStreetMap */
  layerType: "OpenStreetMap";
  /**
   * @deprecated
   */
  type?: "OpenStreetMap";
}

export interface ITiledImageServiceLayer extends ILayer {
  /** Applicable if used as a baseMapLayer. A boolean value indicating whether or not the baseMapLayer draws on top (true) of other layers, including operationalLayers , or below (false). */
  isReference?: boolean;
  /** String indicating the layer type. Value of this property must be ArcGISTiledImageServiceLayer */
  layerType: "ArcGISTiledImageServiceLayer";
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: number;
}

/**
 * Exclusion areas define extent areas where no data will be fetched for a layer.
 */
export interface IExclusionArea {
  /** The geometry defining the area where no data will be fetched. Only extent is supported. */
  geometry?: IGeometry;
  /** The zoom level where the exclusion ends. */
  maxScale?: number;
  /** The zoom level where the exclusion ends. */
  maxZoom?: number;
  /** The zoom level where the exclusion starts. */
  minScale?: number;
  /** The zoom level where the exclusion starts. */
  minZoom?: number;
}

/**
 * An ArcGIS Tiled Map Service layer displays map content from an ArcGIS Server Map service that has been cached (tiled).
 */
export interface ITiledMapServiceLayer extends ILayer {
  /**
   * NOTE: Applicable if used as a baseMapLayer. Integer value(s) indicating the display levels of the basemap layer.
   * Only applicable for TiledMapService layers. All tiled map service layers should share the same tiling scheme.
   * This property cannot be set via the Map Viewer UI.
   */
  displayLevels?: number | number[];
  /**
   * NOTE: Applicable if used as a baseMapLayer. An array of exclusionArea objects defining the layer exclusions.
   */
  exclusionAreas?: IExclusionArea[];
  /** This property is applicable if used as a baseMapLayer. A boolean value indicating whether or not the baseMapLayer draws on top (true) of other layers, including operationalLayers , or below (false). */
  isReference?: any;
  /** Optional string containing the item ID of the service if it's registered on ArcGIS Online or your organization's portal. */
  itemId?: any;
  /** String indicating the layer type. */
  layerType: "ArcGISTiledMapServiceLayer";
  /** An array of layer objects defining a URL for queries and the popup window content. */
  layers?: IChildLayer[];
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: number;
}

/**
 * A vector tile layer references a set of web-accessible vector tiles and the corresponding style for how those tiles should be drawn.
 */
export interface IVectorTileLayer extends ILayer {
  /** String indicating the layer type. */
  layerType: "VectorTileLayer";
  /** A url to a JSON file containing the stylesheet information used to render the layer. You may also pass an object containing the stylesheet information identical to the JSON file. */
  styleUrl?: string;
  /** Deprecated. User layerType instead. */
  type?: "VectorTileLayer";
}

export interface ILod {
  /** ID for each level. */
  level?: number;
  /** String to be used when constructing URL to access a tile from this LOD. */
  levelValue?: string;
  /** Resolution in map units of each pixel in a tile for each level. */
  resolution?: number;
  /** Scale for each level. */
  scale?: number;
}

/**
 * Tile information, returned from the WMTS OGC Web Service. The tileInfo will contain the spatial reference of the layer.
 * tileInfo is the same json representation as the ArcGIS Map/Image service tileInfo except that it may contain a levelValue
 * on the lod objects that should be used instead of the level in the templateUrl.
 */
export interface ITileInfo {
  /** Requested tile's column. */
  cols?: any;
  /** Compression quality of the tile. */
  compressionQuality?: any;
  /** The dpi of the tiling scheme. */
  dpi?: any;
  /** Image format of the cached tiles. */
  format?:
    | "jpg"
    | "png"
    | "png24"
    | "png32"
    | "png8"
    | "pdf"
    | "bmp"
    | "gif"
    | "svg"
    | "svgz"
    | "emf"
    | "ps"
    | "mixed"
    | "lerc";

  /** An array of levels of detail that define the tiling scheme. */
  lods?: ILod[];
  /** The tiling scheme origin. */
  origin?: IPoint;
  /** Requested tile's row. */
  rows?: any;
  /** The spatial reference of the tiling schema. */
  spatialReference?: ISpatialReference;
}

/**
 * Object defines and provides information about layers in a WMTSLayer service.
 */
export interface IWebMapTileServiceInfo {
  /** A sequence of parameters used to append different custom parameters to a WMTS tile request. These parameters are applied to GetTile. The customLayerParameters property takes precedence if customParameters is also present. */
  customLayerParameters?: any;
  /** A sequence of parameters used to append custom parameters to all WMTS requests. These parameters are applied to GetCapabilities and GetTile. If used with the customLayerParameters property, customParameters will not take precedence. */
  customParameters?: any;
  /** Identifier for the specific layer used in the WMTS service. Required input by the user. */
  layerIdentifier: string;
  /** Tiling schema, set by the WMTS service. */
  tileMatrixSet?: any;
  /** URL to the WMTS web service. Required input by the user. */
  url: string;
}

export interface IWebTiledLayer extends ILayer {
  /** Attribution to the Web Tiled Layer provider. It is displayed in the attribution on the web map. Input required by the user when the layer is added to the web map. */
  copyright?: any;
  /** An extent object representing the full extent envelope for the layer. */
  fullExtent?: IExtent;
  /** This is applicable if used as a baseMapLayer. A boolean value indicating whether or not the baseMapLayer draws on top (true) of other layers, including operationalLayers , or below (false). */
  isReference?: any;
  /** String indicating the layer type. Value of this property must be WebTiledLayer */
  layerType: "WebTiledLayer";
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: any;
  /** If subdomains are detected, they must be specified. The map viewer detects if the Web Tiled Layer has subdomains by parsing the templateURL value for {subDomain}. */
  subDomains?: any;
  /** URL to the Web Tiled Layer. Input required by the user when the layer is added to the web map. The template URL contains a parameterized URL. The URL can contain the following templated parameters: 'level', 'col', 'row', and 'subDomain'. */
  templateUrl?: any;
  /** Contains the spatial reference and the tiling scheme of the layer. Typically retrieved from a WMTS OGC Web Service. If missing the layer must be in the WGS 1984 Web Mercator (Auxiliary Sphere) tiling scheme. */
  tileInfo?: ITileInfo;
  /**
   * Deprecated, use layerType instead.
   * @deprecated
   */
  type?: "WebTiledLayer";
  /** Object containing information about the chosen WMTS service layer and tiling schema. */
  wmtsInfo?: IWebMapTileServiceInfo;
}

/**
 * The CSV layer type references a CSV or TXT file from a publically-accessible web server. It then dynamically loads into the map at run time. The CSV layer will maintain a reference to the CSV resource.
 */
export interface ICsvLayer extends ILayer {
  /** A string defining the character used to separate columns in a CSV file. */
  columnDelimiter?: "," | " " | ";" | "|" | "\t";
  /** A layerDefinition object defining the attribute schema and drawing information for the layer. */
  layerDefinition?: ILayerDefinition;
  /** String indicating the layer type. */
  layerType: "CSV";
  /** A locationInfo object defining how location information will be retrieved from a CSV file. */
  locationInfo?: any;
  /** A popupInfo object defining the content of popup windows when you click or query a feature. */
  popupInfo?: IPopupInfo;
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: number;
  /** Deprecated, use layerType instead. */
  type?: "CSV";
}

/**
 * Feature layers can be created by referencing a layer from either a map service or a feature service or by specifying a feature collection object.
 * Use a map service if you just want to retrieve geometries and attributes from the server and symbolize them yourself. Use a feature service if
 * you want to take advantage of symbols from the service's source map document. Also, use a feature service if you plan on doing editing with the
 * feature layer. Feature layers honor any feature templates configured in the source map document. Feature collection objects are used to create
 * a feature layer based on the supplied definition.
 */
export interface IFeatureLayer extends ILayer, ISupportsTime {
  /** A comma-separated string listing which editing operations are allowed on an editable feature service. */
  capabilities?: string;
  /** Stores interactive filters. */
  definitionEditor?: IDefinitionEditor;
  /** Indicates whether to allow a client to ignore popups defined by the service item. */
  disablePopup?: true;
  /** A featureCollection object defining a layer of features whose geometry and attributes are either stored directly within the web map or with an item. Feature Collections can be created from CSVs, shapefiles, GPX, or map notes. */
  featureCollection?: any;
  /** Indicates the type of features in the feature collection. If featureCollectionType is missing, it means the feature collection is a regular single-layer or multi-layer feature collection. */
  featureCollectionType?: "markup" | "notes" | "route";

  /** A layerDefinition object defining the attribute schema and drawing information for the layer. */
  layerDefinition?: ILayerDefinition;
  /** String indicating the layer type. */
  layerType: "ArcGISFeatureLayer";
  /** 0 is snapshot mode. 1 is on-demand mode. 2 is selection-only mode. Used with ArcGIS feature services and individual layers in ArcGIS map services. */
  mode?: 0 | 1 | 2;
  /** A popupInfo object defining the content of popup windows when you click or query a feature. */
  popupInfo?: IPopupInfo;
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: number;
  /** Labels will display if this property is set to true and the layer also has a labelingInfo property associated with it. This property can get stored in the web map config and in the item/data. */
  showLabels?: true;
  /** An array of sublayer ids that should appear visible. Used with feature layers that are based on feature collections. */
  visibleLayers?: number[];
}

export interface IGeoRssLayer extends ILayer {
  /** String indicating the layer type. */
  layerType: "GeoRSS";
  /** Defined by the GeoRSS to JSON request service. If the GeoRSS feed does not have lines, this property is not added to the layer JSON. */
  lineSymbol?: ISimpleLineSymbol;
  /** Defined by the GeoRSS to JSON request service. If the GeoRSS feed does not have points, this property is not added to the layer JSON. */
  pointSymbol?: IPictureMarkerSymbol;
  /** Defined by the GeoRSS to JSON request service. If the GeoRSS feed does not have polygons, this property is not added to the layer JSON. */
  polygonSymbol?: ISimpleFillSymbol;
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: number;
  /**
   * Deprecated, please use layerType.
   * @deprecated
   */
  type?: "GeoRSS";
}

export interface IKmlLayer extends ILayer {
  /** String indicating the layer type. */
  layerType: "KML";
  /** A number representing the maximum scale at which the layer will be visible. The number is the scale's denominator. */
  maxScale?: any;
  /** A number representing the minimum scale at which the layer will be visible. The number is the scale's denominator. */
  minScale?: any;
  /** The degree of transparency applied to the layer on the client side, where 0 is full transparency and 1 is no transparency. */
  opacity?: any;
  /** Refresh interval of the layer in minutes. Non-zero value indicates automatic layer refresh at the specified interval. Value of 0 indicates auto refresh is not enabled. */
  refreshInterval?: any;
  /** Indicates whether to allow map authors the ability to control what layers should be shown in a client's legend. */
  showLegend?: any;
  /** A user-friendly string title for the layer that can be used in a table of contents. */
  title?: any;
  /**
   * @deprecated
   * Use layerType instead.
   */
  type?: "KML";
  /** Array of numeric IDs of folders that will be made visible. */
  visibleFolders?: number[];
}

export interface IArcGisStreamLayer extends ILayer {
  /** Stores interactive filters. */
  definitionEditor?: IDefinitionEditor;
  /** Indicates whether to ignore popups defined by the service item. */
  disablePopup?: boolean;
  /** A layerDefinition object defining the attribute schema and drawing information for the layer. */
  layerDefinition?: ILayerDefinition;
  /** String indicating the layer type. */
  layerType: "ArcGISStreamLayer";
  /** A popupInfo object defining the content of pop-up windows when you click or query a feature. */
  popupInfo?: IPopupInfo;
}
