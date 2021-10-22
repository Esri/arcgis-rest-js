/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IGeometry,
  IHasZM,
  ISpatialReference,
  GeometryType
} from "./geometry.js";
import { ISymbol } from "./symbol.js";

/**
 * a spatial entity and its corresponding properties
 *
 * `IFeature` can also be imported from the following packages:
 *
 * ```js
 * import { IFeature } from "@esri/arcgis-rest-features";
 * import { IFeature } from "@esri/arcgis-rest-routing";
 * ```
 */
export interface IFeature {
  geometry?: IGeometry;
  attributes: { [key: string]: any };
  symbol?: ISymbol;
}

/**
 * `IFeatureSet` can also be imported from the following packages:
 *
 * ```js
 * import { IFeatureSet } from "@esri/arcgis-rest-features";
 * ```
 */
export interface IFeatureSet extends IHasZM {
  objectIdFieldName?: string; // optional
  globalIdFieldName?: string; // optional
  displayFieldName?: string; // optional
  geometryType?: GeometryType; // for feature layers only
  spatialReference?: ISpatialReference; // for feature layers only.
  fields?: IField[];
  features: IFeature[];
  fieldAliases?: {
    [key: string]: string;
  };
}


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
export type DomainType = "range" | "codedValue" | "inherited";

/**
* CodedValue type
*/
export type ICodedValue = {
 /**  User-friendly name for what the code means. */
 name: string;
 /**  The value stored in the feature attribute. */
 code: string | number;
};

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
 description?: string;
 /** Merge policy */
 mergePolicy?: string;
 /** Split Policy */
 splitPolicy?: string;
};


/**
 * Contains information about an attribute field.
 *
 * `IField` can also be imported from the following packages:
 *
 * ```js
 * import { IField } from "@esri/arcgis-rest-features";
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