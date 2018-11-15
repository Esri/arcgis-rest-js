/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IField } from "@esri/arcgis-rest-common-types";

export const serviceFields: IField[] = [
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
