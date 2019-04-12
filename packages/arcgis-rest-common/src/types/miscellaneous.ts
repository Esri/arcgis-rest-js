/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroup } from "./group";

/**
 * Field type.
 */
export type esriFieldType =
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
 * Contains information about an attribute field.
 */
export interface IField {
  /** A string defining the field name. */
  name: string;
  /** A string defining the field type. */
  type: esriFieldType;
  /** A string defining the field alias. */
  alias?: string;
  /** The domain objects if applicable. */
  domain?: any;
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
 */
export interface IPagingParams {
  start?: number;
  num?: number;
}

/**
 * An ArcGIS Online or Enterprise user
 */
export interface IUser {
  username?: string;
  fullName?: string;
  availableCredits?: number;
  assignedCredits?: number;
  firstName?: string;
  lastName?: string;
  preferredView?: any;
  description?: string;
  email?: string;
  idpUsername?: string;
  favGroupId?: string;
  lastLogin?: number;
  mfaEnabled?: boolean;
  access?: string;
  storageUsage?: number;
  storageQuota?: number;
  orgId?: string;
  role?: "org_admin" | "org_publisher" | "org_user";
  privileges?: string[];
  roleId?: string;
  level?: string;
  disabled?: boolean;
  units?: string;
  tags?: string[];
  culture?: string;
  region?: string;
  thumbnail?: string;
  created?: number;
  modified?: number;
  groups?: IGroup[];
  provider?: "arcgis" | "enterprise" | "facebook" | "google";
}
