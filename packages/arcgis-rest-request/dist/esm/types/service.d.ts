/**
 * Field type.
 */
export declare type FieldType = "esriFieldTypeBlob" | "esriFieldTypeDate" | "esriFieldTypeDouble" | "esriFieldTypeGeometry" | "esriFieldTypeGlobalID" | "esriFieldTypeGUID" | "esriFieldTypeInteger" | "esriFieldTypeOID" | "esriFieldTypeRaster" | "esriFieldTypeSingle" | "esriFieldTypeSmallInteger" | "esriFieldTypeString" | "esriFieldTypeXML";
/**
 * Domain types
 */
export declare type DomainType = "range" | "codedValue" | "inherited";
/**
 * CodedValue type
 */
export declare type ICodedValue = {
    /**  User-friendly name for what the code means. */
    name: string;
    /**  The value stored in the feature attribute. */
    code: string | number;
};
/**
 * Information for a field with a domain
 */
export declare type IDomain = {
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
 * import { IField } from "@esri/arcgis-rest-feature-service";
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
