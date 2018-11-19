/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IField } from "@esri/arcgis-rest-common-types";

export const cvdServiceFields: IField[] = [
  {
    name: "objectid",
    type: "esriFieldTypeOID",
    alias: "OBJECTID",
    domain: null,
    editable: false,
    nullable: false
  },
  {
    name: "requestid",
    type: "esriFieldTypeString",
    alias: "Service Request ID",
    domain: null,
    editable: true,
    nullable: true,
    length: 25
  },
  {
    name: "requesttype",
    type: "esriFieldTypeString",
    alias: "Problem",
    domain: {
      type: "codedValue",
      name: "ServiceRequestType",
      description: "The type of service request submitted by general public",
      codedValues: [
        {
          name: "Blight",
          code: 0
        },
        {
          name: "Bridge Impassible",
          code: 1
        },
        {
          name: "Business Closed",
          code: 2
        }
      ],
      mergePolicy: "esriMPTDefaultValue",
      splitPolicy: "esriSPTDefaultValue"
    },
    editable: true,
    nullable: true,
    length: 100
  },
  {
    name: "name",
    type: "esriFieldTypeString",
    alias: "Name",
    domain: null,
    editable: true,
    nullable: true,
    length: 150
  },
  {
    name: "phone",
    type: "esriFieldTypeString",
    alias: "Phone Number",
    domain: null,
    editable: true,
    nullable: true,
    length: 12
  },
  {
    name: "email",
    type: "esriFieldTypeString",
    alias: "Email Address",
    domain: null,
    editable: true,
    nullable: true,
    length: 100
  },
  {
    name: "requestdate",
    type: "esriFieldTypeDate",
    alias: "Date Submitted",
    domain: null,
    editable: true,
    nullable: true,
    length: 8
  },
  {
    name: "status",
    type: "esriFieldTypeString",
    alias: "Status",
    domain: {
      type: "codedValue",
      name: "ServiceRequestStatus",
      description: "The status of the resolution of a service request",
      codedValues: [
        {
          name: "Unassigned",
          code: "Unassigned"
        },
        {
          name: "Assigned",
          code: "Assigned"
        },
        {
          name: "Closed",
          code: "Closed"
        }
      ],
      mergePolicy: "esriMPTDefaultValue",
      splitPolicy: "esriSPTDefaultValue"
    },
    editable: true,
    nullable: true,
    length: 50
  },
  {
    name: "globalid",
    type: "esriFieldTypeGlobalID",
    alias: "GlobalID",
    domain: null,
    editable: false,
    nullable: false,
    length: 38
  },
  {
    name: "building",
    type: "esriFieldTypeString",
    alias: "Building Name",
    domain: null,
    editable: true,
    nullable: true,
    length: 25
  },
  {
    name: "floor",
    type: "esriFieldTypeString",
    alias: "Floor Number",
    domain: null,
    editable: true,
    nullable: true,
    length: 5
  }
];

export const serviceFields: IField[] = [
  {
    name: "FID",
    type: "esriFieldTypeOID",
    // "actualType" : "int",
    alias: "FID",
    // "sqlType" : "sqlTypeInteger",
    nullable: false,
    editable: false,
    domain: null,
    defaultValue: null
  },
  {
    name: "Tree_ID",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Tree_ID",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Collected",
    type: "esriFieldTypeDate",
    // "actualType" : "datetime2",
    alias: "Collected",
    // "sqlType" : "sqlTypeTimestamp2",
    length: 8,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Crew",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Crew",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Status",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Status",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Spp_Code",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Spp_Code",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Land_Use",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Land_Use",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Ht_DBH_ft",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "Ht_DBH_ft",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "DBH1",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "DBH1",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "DBH2",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "DBH2",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "DBH3",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "DBH3",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "DBH4",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "DBH4",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "DBH5",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "DBH5",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "DBH6",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "DBH6",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Height",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Height",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Live_Top",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Live_Top",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Crown_Base",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Crown_Base",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Width_NS",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Width_NS",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Width_EW",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Width_EW",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Cn_Missing",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Cn_Missing",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Cn_DieBack",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Cn_DieBack",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "CLE",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "CLE",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Tree_Site",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Tree_Site",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Tree_Age",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Tree_Age",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Notes",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Notes",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Cmn_Name",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Cmn_Name",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Sci_Name",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Sci_Name",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "GroundArea",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "GroundArea",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Condition",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Condition",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Leaf_Area",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Leaf_Area",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Leaf_Bmass",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "Leaf_Bmass",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "LAI",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "LAI",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "C_Storage",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "C_Storage",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "C_Seq",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "C_Seq",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "S_Value",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "S_Value",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Street",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Street",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Native",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Native",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "CO_Rmvd",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "CO_Rmvd",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "O3_Rmvd",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "O3_Rmvd",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "NO2_Rmvd",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "NO2_Rmvd",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "PM10_Rmvd",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "PM10_Rmvd",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "SO2_Rmvd",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "SO2_Rmvd",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "PM2p5_Rmvd",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "PM2p5_Rmvd",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "CO_RVlu",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "CO_RVlu",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "O3_Rvlu",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "O3_Rvlu",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "NO2_Rvlu",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "NO2_Rvlu",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "PM10_Rvlu",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "PM10_Rvlu",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "SO2_Rvlu",
    type: "esriFieldTypeInteger",
    // "actualType" : "int",
    alias: "SO2_Rvlu",
    // "sqlType" : "sqlTypeInteger",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "PM2p5_RVlu",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "PM2p5_RVlu",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Isoprene_E",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "Isoprene_E",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Monoterp_E",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "Monoterp_E",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Vocs_E",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "Vocs_E",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Dedication",
    type: "esriFieldTypeString",
    // "actualType" : "nvarchar",
    alias: "Dedication",
    // "sqlType" : "sqlTypeNVarchar",
    length: 254,
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Longitude",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "Longitude",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Latitude",
    type: "esriFieldTypeDouble",
    // "actualType" : "float",
    alias: "Latitude",
    // "sqlType" : "sqlTypeFloat",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  },
  {
    name: "Crown_Height",
    type: "esriFieldTypeDouble",
    alias: "",
    // "sqlType" : "sqlTypeOther",
    nullable: true,
    editable: true,
    domain: null,
    defaultValue: null
  }
];
