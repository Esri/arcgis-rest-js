/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IQueryFeaturesResponse } from "../../src/query";
import { IFeature, IGeometry } from "@esri/arcgis-rest-common-types";

export const cvdQueryResponse: IQueryFeaturesResponse = {
  objectIdFieldName: "objectid",
  globalIdFieldName: "globalid",
  geometryType: "esriGeometryPoint",
  spatialReference: {
    wkid: 102100,
    latestWkid: 3857
  },
  fields: [
    {
      name: "objectid",
      alias: "OBJECTID",
      type: "esriFieldTypeOID"
    },
    {
      name: "requestid",
      alias: "Service Request ID",
      type: "esriFieldTypeString",
      length: 25
    },
    {
      name: "requesttype",
      alias: "Problem",
      type: "esriFieldTypeString",
      length: 100
    },
    {
      name: "comments",
      alias: "Comments",
      type: "esriFieldTypeString",
      length: 255
    },
    {
      name: "name",
      alias: "Name",
      type: "esriFieldTypeString",
      length: 150
    },
    {
      name: "phone",
      alias: "Phone Number",
      type: "esriFieldTypeString",
      length: 12
    },
    {
      name: "email",
      alias: "Email Address",
      type: "esriFieldTypeString",
      length: 100
    },
    {
      name: "requestdate",
      alias: "Date Submitted",
      type: "esriFieldTypeDate",
      length: 8
    },
    {
      name: "status",
      alias: "Status",
      type: "esriFieldTypeString",
      length: 50
    },
    {
      name: "globalid",
      alias: "GlobalID",
      type: "esriFieldTypeGlobalID",
      length: 38
    },
    {
      name: "building",
      alias: "Building Name",
      type: "esriFieldTypeString",
      length: 25
    },
    {
      name: "floor",
      alias: "Floor Number",
      type: "esriFieldTypeString",
      length: 5
    },
    {
      name: "floor_SUM",
      alias: "Floor Number Summary (not in raw dataset, only from stat query",
      type: "esriFieldTypeString",
      length: 10
    }
  ],
  features: [
    {
      attributes: {
        objectid: 1234941,
        requestid: null,
        requesttype: 0,
        comments: null,
        name: null,
        phone: null,
        email: null,
        requestdate: null,
        status: "Closed",
        globalid: "{2F47ACF0-CEE3-4548-90A8-785ED7BE01C9}",
        building: null,
        floor: null,
        floor_SUM: "something"
      },
      geometry: {
        x: -9603128.0234949309,
        y: 5114408.4976249589
      } as IGeometry
    },
    {
      attributes: {
        objectid: 1234942,
        requestid: null,
        requesttype: 1,
        comments: null,
        name: null,
        phone: null,
        email: null,
        requestdate: null,
        status: "Closed",
        globalid: "{9937CFDD-E811-49D1-8CC8-A1ABF0DE7F14}",
        building: null,
        floor: null,
        floor_SUM: "something"
      },
      geometry: {
        x: -9603103.0477722641,
        y: 5114303.7610201165
      } as IGeometry
    },
    {
      attributes: {
        objectid: 1235479,
        requestid: "1",
        requesttype: 4,
        comments: "Plow my street. ",
        name: "Lindsay Carter",
        phone: "999-9999",
        email: "Lindsay@Lindsay.com",
        requestdate: 1295252247000,
        status: "Unassigned",
        globalid: "{D840094C-F94D-42EA-AB21-7A84B2E27962}",
        building: null,
        floor: "0",
        floor_SUM: "something"
      },
      geometry: {
        x: -9814396.0827533137,
        y: 5124911.0747664627
      } as IGeometry
    }
  ] as IFeature[]
};

export const cvdFeaturesFormatted: IFeature[] = [
  {
    attributes: {
      objectid: 1234941,
      requestid: null,
      requesttype: "Blight",
      comments: null,
      name: null,
      phone: null,
      email: null,
      requestdate: null,
      status: "Closed",
      globalid: "{2F47ACF0-CEE3-4548-90A8-785ED7BE01C9}",
      building: null,
      floor: null,
      floor_SUM: "something"
    },
    geometry: {
      x: -9603128.0234949309,
      y: 5114408.4976249589
    } as IGeometry
  },
  {
    attributes: {
      objectid: 1234942,
      requestid: null,
      requesttype: "Bridge Impassible",
      comments: null,
      name: null,
      phone: null,
      email: null,
      requestdate: null,
      status: "Closed",
      globalid: "{9937CFDD-E811-49D1-8CC8-A1ABF0DE7F14}",
      building: null,
      floor: null,
      floor_SUM: "something"
    },
    geometry: {
      x: -9603103.0477722641,
      y: 5114303.7610201165
    } as IGeometry
  },
  {
    attributes: {
      objectid: 1235479,
      requestid: "1",
      requesttype: 4, // mock code without associated name
      comments: "Plow my street. ",
      name: "Lindsay Carter",
      phone: "999-9999",
      email: "Lindsay@Lindsay.com",
      requestdate: 1295252247000,
      status: "Unassigned",
      globalid: "{D840094C-F94D-42EA-AB21-7A84B2E27962}",
      building: null,
      floor: "0",
      floor_SUM: "something"
    },
    geometry: {
      x: -9814396.0827533137,
      y: 5124911.0747664627
    } as IGeometry
  }
];
