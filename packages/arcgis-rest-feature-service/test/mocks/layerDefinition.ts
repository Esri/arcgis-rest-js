/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ILayerDefinition, IExtent } from "@esri/arcgis-rest-common";

const defaultExtent: IExtent = {
  xmin: -180,
  ymin: -90,
  xmax: 180,
  ymax: 90,
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  }
};

export const layerDefinitionSid: ILayerDefinition = {
  allowGeometryUpdates: true,
  capabilities: "Create,Delete,Query,Update,Editing",
  copyrightText: "",
  defaultVisibility: true,
  description: "",
  drawingInfo: {
    transparency: 0,
    labelingInfo: null,
    renderer: {
      type: "simple",
      symbol: {
        color: [20, 158, 206, 70],
        outline: {
          color: [255, 255, 255, 229],
          width: 2.25,
          type: "esriSLS",
          style: "esriSLSSolid"
        },
        type: "esriSFS",
        style: "esriSFSSolid"
      }
    }
  },
  extent: defaultExtent,
  fields: [
    {
      name: "OBJECTID",
      type: "esriFieldTypeOID",
      alias: "OBJECTID",
      nullable: false,
      editable: false,
      domain: null
    },
    {
      name: "author",
      type: "esriFieldTypeString",
      alias: "author",
      length: 256,
      nullable: false,
      editable: true,
      domain: null,
      defaultValue: null
    }
  ],
  geometryType: "esriGeometryPolygon",
  hasAttachments: true,
  hasZ: false,
  hasStaticData: false,
  htmlPopupType: "esriServerHTMLPopupTypeNone",
  isDataVersioned: false,
  maxRecordCount: 2000,
  name: "hub_annotations",
  objectIdField: "OBJECTID",
  relationships: [],
  supportsAdvancedQueries: true,
  supportsRollbackOnFailureParameter: true,
  supportsStatistics: true,
  type: "Feature Layer",
  typeIdField: "",
  types: [],
  timeInfo: {}
};
