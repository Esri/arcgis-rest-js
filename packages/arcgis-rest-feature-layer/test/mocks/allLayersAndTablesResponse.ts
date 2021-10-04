import { IAllLayersAndTablesResponse } from "../../src/getAllLayersAndTables.js";

export const allLayersAndTablesResponse: IAllLayersAndTablesResponse = {
  layers: [
    {
      id: 0,
      name: "Wells",
      type: "Feature Layer",
      description: "",
      definitionExpression: "",
      geometryType: "esriGeometryPoint",
      copyrightText: "",
      minScale: 0,
      maxScale: 0,
      defaultVisibility: false,
      extent: {
        xmin: -102.048629,
        ymin: 5.6843418860808e-14,
        xmax: 5.6843418860808e-14,
        ymax: 40.0020000000001,
        spatialReference: {
          wkid: 4267
        }
      },
      hasAttachments: false,
      timeInfo: {
        startTimeField: "COMPLETION",
        endTimeField: "PLUG_DATE",
        trackIdField: null,
        timeExtent: [-2556057600000, 1246060800000],
        timeReference: null,
        timeInterval: 3,
        timeIntervalUnits: "esriTimeUnitsYears",
        exportOptions: {
          useTime: true,
          timeDataCumulative: false,
          timeOffset: null,
          timeOffsetUnits: null
        }
      },
      drawingInfo: {
        renderer: {
          type: "simple",
          symbol: {
            type: "esriSMS",
            style: "esriSMSCircle",

            color: [166, 36, 0, 255],
            size: 4,
            angle: 0,
            xoffset: 0,
            yoffset: 0,
            outline: {
              color: [0, 0, 0, 255],
              width: 1
            }
          },
          label: "",
          description: ""
        },
        scaleSymbols: true,
        transparency: 0,
        labelingInfo: null
      },
      displayField: "FIELD_NAME",
      fields: [
        {
          name: "OBJECTID",
          type: "esriFieldTypeOID",
          alias: "OBJECTID"
        },
        {
          name: "Shape",
          type: "esriFieldTypeGeometry",
          alias: "Shape"
        },
        {
          name: "KID",
          type: "esriFieldTypeDouble",
          alias: "KID"
        },
        {
          name: "STATE_CODE",
          type: "esriFieldTypeSmallInteger",
          alias: "STATE_CODE"
        },
        {
          name: "COUNTY_COD",
          type: "esriFieldTypeSmallInteger",
          alias: "COUNTY_COD"
        },
        {
          name: "API_WELL_N",
          type: "esriFieldTypeInteger",
          alias: "API_WELL_N"
        },
        {
          name: "API_WORKOV",
          type: "esriFieldTypeString",
          alias: "API_WORKOV",
          length: 4
        },
        {
          name: "FIELD_NAME",
          type: "esriFieldTypeString",
          alias: "FIELD_NAME",
          length: 40
        },
        {
          name: "FIELD_KID",
          type: "esriFieldTypeDouble",
          alias: "FIELD_KID"
        },
        {
          name: "LEASE_NAME",
          type: "esriFieldTypeString",
          alias: "LEASE_NAME",
          length: 60
        },
        {
          name: "WELL_NAME",
          type: "esriFieldTypeString",
          alias: "WELL_NAME",
          length: 40
        },
        {
          name: "WELL_CLASS",
          type: "esriFieldTypeString",
          alias: "WELL_CLASS",
          length: 50
        },
        {
          name: "OPERATOR_N",
          type: "esriFieldTypeString",
          alias: "OPERATOR_N",
          length: 100
        },
        {
          name: "OPERATOR_K",
          type: "esriFieldTypeDouble",
          alias: "OPERATOR_K"
        },
        {
          name: "LATITUDE",
          type: "esriFieldTypeDouble",
          alias: "LATITUDE"
        },
        {
          name: "LATITUDE_L",
          type: "esriFieldTypeDouble",
          alias: "LATITUDE_L"
        },
        {
          name: "LATITUDE_1",
          type: "esriFieldTypeDouble",
          alias: "LATITUDE_1"
        },
        {
          name: "LATITUDE_D",
          type: "esriFieldTypeString",
          alias: "LATITUDE_D",
          length: 1
        },
        {
          name: "LONGITUDE",
          type: "esriFieldTypeDouble",
          alias: "LONGITUDE"
        },
        {
          name: "LONGITUDE_",
          type: "esriFieldTypeDouble",
          alias: "LONGITUDE_"
        },
        {
          name: "LONGITUDE1",
          type: "esriFieldTypeDouble",
          alias: "LONGITUDE1"
        },
        {
          name: "LONGITUD_1",
          type: "esriFieldTypeString",
          alias: "LONGITUD_1",
          length: 1
        },
        {
          name: "LONGITUD_2",
          type: "esriFieldTypeString",
          alias: "LONGITUD_2",
          length: 20
        },
        {
          name: "PRINCIPAL_",
          type: "esriFieldTypeString",
          alias: "PRINCIPAL_",
          length: 20
        },
        {
          name: "TOWNSHIP",
          type: "esriFieldTypeSmallInteger",
          alias: "TOWNSHIP"
        },
        {
          name: "TOWNSHIP_D",
          type: "esriFieldTypeString",
          alias: "TOWNSHIP_D",
          length: 1
        },
        {
          name: "RANGE",
          type: "esriFieldTypeSmallInteger",
          alias: "RANGE"
        },
        {
          name: "RANGE_DIRE",
          type: "esriFieldTypeString",
          alias: "RANGE_DIRE",
          length: 1
        },
        {
          name: "SECTION",
          type: "esriFieldTypeSmallInteger",
          alias: "SECTION"
        },
        {
          name: "SUBDIVISIO",
          type: "esriFieldTypeString",
          alias: "SUBDIVISIO",
          length: 2
        },
        {
          name: "SUBDIVIS_1",
          type: "esriFieldTypeString",
          alias: "SUBDIVIS_1",
          length: 2
        },
        {
          name: "SUBDIVIS_2",
          type: "esriFieldTypeString",
          alias: "SUBDIVIS_2",
          length: 2
        },
        {
          name: "SUBDIVIS_3",
          type: "esriFieldTypeString",
          alias: "SUBDIVIS_3",
          length: 2
        },
        {
          name: "SPOT",
          type: "esriFieldTypeString",
          alias: "SPOT",
          length: 2
        },
        {
          name: "FEET_NORTH",
          type: "esriFieldTypeInteger",
          alias: "FEET_NORTH"
        },
        {
          name: "FEET_EAST_",
          type: "esriFieldTypeInteger",
          alias: "FEET_EAST_"
        },
        {
          name: "REFERENCE_",
          type: "esriFieldTypeString",
          alias: "REFERENCE_",
          length: 2
        },
        {
          name: "MEETS_AND_",
          type: "esriFieldTypeString",
          alias: "MEETS_AND_",
          length: 254
        },
        {
          name: "ELEVATION_",
          type: "esriFieldTypeString",
          alias: "ELEVATION_",
          length: 40
        },
        {
          name: "ELEVATION",
          type: "esriFieldTypeDouble",
          alias: "ELEVATION"
        },
        {
          name: "ROTARY_TOT",
          type: "esriFieldTypeInteger",
          alias: "ROTARY_TOT"
        },
        {
          name: "ROTARY_T_1",
          type: "esriFieldTypeString",
          alias: "ROTARY_T_1",
          length: 60
        },
        {
          name: "STATUS",
          type: "esriFieldTypeString",
          alias: "STATUS",
          length: 20
        },
        {
          name: "DATA_SOURC",
          type: "esriFieldTypeString",
          alias: "DATA_SOURC",
          length: 40
        },
        {
          name: "SPUD_DATE",
          type: "esriFieldTypeDate",
          alias: "SPUD_DATE",
          length: 8
        },
        {
          name: "PERMIT_DAT",
          type: "esriFieldTypeDate",
          alias: "PERMIT_DAT",
          length: 8
        },
        {
          name: "COMPLETION",
          type: "esriFieldTypeDate",
          alias: "COMPLETION",
          length: 8
        },
        {
          name: "OLD_API_NU",
          type: "esriFieldTypeString",
          alias: "OLD_API_NU",
          length: 200
        },
        {
          name: "OLD_LOCATI",
          type: "esriFieldTypeString",
          alias: "OLD_LOCATI",
          length: 200
        },
        {
          name: "OLD_WELL_N",
          type: "esriFieldTypeString",
          alias: "OLD_WELL_N",
          length: 254
        },
        {
          name: "UPDATE_INI",
          type: "esriFieldTypeString",
          alias: "UPDATE_INI",
          length: 30
        },
        {
          name: "UPDATE_DAT",
          type: "esriFieldTypeDate",
          alias: "UPDATE_DAT",
          length: 8
        },
        {
          name: "API_NUMBER",
          type: "esriFieldTypeString",
          alias: "API_NUMBER",
          length: 40
        },
        {
          name: "PLUG_DATE",
          type: "esriFieldTypeDate",
          alias: "PLUG_DATE",
          length: 8
        },
        {
          name: "SKIP_IT",
          type: "esriFieldTypeString",
          alias: "SKIP_IT",
          length: 2
        },
        {
          name: "OLD_FOOTAG",
          type: "esriFieldTypeString",
          alias: "OLD_FOOTAG",
          length: 200
        },
        {
          name: "OLD_QUARTE",
          type: "esriFieldTypeString",
          alias: "OLD_QUARTE",
          length: 200
        },
        {
          name: "COMMENTS",
          type: "esriFieldTypeString",
          alias: "COMMENTS",
          length: 254
        },
        {
          name: "ELEVATION1",
          type: "esriFieldTypeDouble",
          alias: "ELEVATION1"
        },
        {
          name: "ELEVATIO_1",
          type: "esriFieldTypeDouble",
          alias: "ELEVATIO_1"
        },
        {
          name: "ELEVATIO_2",
          type: "esriFieldTypeDouble",
          alias: "ELEVATIO_2"
        },
        {
          name: "ELEVATIO_3",
          type: "esriFieldTypeDouble",
          alias: "ELEVATIO_3"
        },
        {
          name: "TOP_CARD_C",
          type: "esriFieldTypeString",
          alias: "TOP_CARD_C",
          length: 30
        },
        {
          name: "TOP_CARD_1",
          type: "esriFieldTypeDate",
          alias: "TOP_CARD_1",
          length: 8
        },
        {
          name: "INITIAL_PR",
          type: "esriFieldTypeDouble",
          alias: "INITIAL_PR"
        },
        {
          name: "INITIAL__1",
          type: "esriFieldTypeDouble",
          alias: "INITIAL__1"
        },
        {
          name: "INITIAL__2",
          type: "esriFieldTypeDouble",
          alias: "INITIAL__2"
        },
        {
          name: "WELL_HEADE",
          type: "esriFieldTypeDouble",
          alias: "WELL_HEADE"
        },
        {
          name: "GAS_LEASE_",
          type: "esriFieldTypeDouble",
          alias: "GAS_LEASE_"
        },
        {
          name: "OIL_LEASE_",
          type: "esriFieldTypeDouble",
          alias: "OIL_LEASE_"
        },
        {
          name: "GAS_LEASE1",
          type: "esriFieldTypeString",
          alias: "GAS_LEASE1",
          length: 100
        },
        {
          name: "OIL_LEASE1",
          type: "esriFieldTypeString",
          alias: "OIL_LEASE1",
          length: 100
        },
        {
          name: "PRODUCING_",
          type: "esriFieldTypeString",
          alias: "PRODUCING_",
          length: 100
        },
        {
          name: "PRODUCING1",
          type: "esriFieldTypeString",
          alias: "PRODUCING1",
          length: 100
        },
        {
          name: "PRODUCIN_1",
          type: "esriFieldTypeDouble",
          alias: "PRODUCIN_1"
        },
        {
          name: "PRODUCIN_2",
          type: "esriFieldTypeString",
          alias: "PRODUCIN_2",
          length: 40
        },
        {
          name: "ROTARY_T_2",
          type: "esriFieldTypeDouble",
          alias: "ROTARY_T_2"
        },
        {
          name: "BOTTOM_HOL",
          type: "esriFieldTypeSmallInteger",
          alias: "BOTTOM_HOL"
        },
        {
          name: "BOTTOM_H_1",
          type: "esriFieldTypeString",
          alias: "BOTTOM_H_1",
          length: 40
        },
        {
          name: "API_NUMB_1",
          type: "esriFieldTypeString",
          alias: "API_NUMB_1",
          length: 14
        },
        {
          name: "WELL_TYPE",
          type: "esriFieldTypeString",
          alias: "WELL_TYPE",
          length: 20
        },
        {
          name: "WELL_DEPTH_SEALEVEL",
          type: "esriFieldTypeInteger",
          alias: "WELL_DEPTH_SEALEVEL"
        }
      ],
      relationships: [
        {
          id: 3,
          name: "Well 2 Tops",
          relatedTableId: 2
        },
        {
          id: 2,
          name: "Wells 2 Field",
          relatedTableId: 1
        }
      ],
      maxRecordCount: 1000,
      supportsStatistics: true,
      supportsAdvancedQueries: false,
      capabilities: "Map,Query,Data",
      supportedQueryFormats: "JSON",
      ownershipBasedAccessControlForFeatures: true
    },
    {
      id: 1,
      name: "KSFields3",
      type: "Feature Layer",
      description: "",
      definitionExpression: "",
      geometryType: "esriGeometryPolygon",
      copyrightText: "",
      minScale: 0,
      maxScale: 0,
      defaultVisibility: true,
      extent: {
        xmin: -102.049575703,
        ymin: 36.99545613,
        xmax: -94.602935923,
        ymax: 40.002644049,
        spatialReference: {
          wkid: 4267
        }
      },
      hasAttachments: false,
      drawingInfo: {
        renderer: {
          type: "uniqueValue",
          field1: "PROD_GAS",
          field2: "PROD_OIL",
          field3: null,
          fieldDelimiter: ", ",
          defaultSymbol: {
            type: "esriSFS",
            style: "esriSFSSolid",

            color: [199, 215, 252, 255],
            outline: {
              type: "esriSLS",
              style: "esriSLSSolid",

              color: [110, 110, 110, 255],
              width: 0.4
            }
          },
          defaultLabel: "\u003call other values\u003e",
          uniqueValueInfos: [
            {
              value: " ,  ",
              label: " ,  ",
              description: "",
              symbol: {
                type: "esriSFS",
                style: "esriSFSSolid",

                color: [204, 204, 204, 255],
                outline: {
                  type: "esriSLS",
                  style: "esriSLSSolid",

                  color: [110, 110, 110, 255],
                  width: 0.4
                }
              }
            },
            {
              value: "No, No",
              label: "No, No",
              description: "",
              symbol: {
                type: "esriSFS",
                style: "esriSFSSolid",

                color: [204, 204, 204, 255],
                outline: {
                  type: "esriSLS",
                  style: "esriSLSSolid",

                  color: [110, 110, 110, 255],
                  width: 0.4
                }
              }
            },
            {
              value: "No, Yes",
              label: "No, Yes",
              description: "",
              symbol: {
                type: "esriSFS",
                style: "esriSFSSolid",

                color: [56, 168, 0, 255],
                outline: {
                  type: "esriSLS",
                  style: "esriSLSSolid",

                  color: [110, 110, 110, 255],
                  width: 0.4
                }
              }
            },
            {
              value: "Yes, No",
              label: "Yes, No",
              description: "",
              symbol: {
                type: "esriSFS",
                style: "esriSFSSolid",

                color: [230, 0, 0, 255],
                outline: {
                  type: "esriSLS",
                  style: "esriSLSSolid",

                  color: [110, 110, 110, 255],
                  width: 0.4
                }
              }
            },
            {
              value: "Yes, Yes",
              label: "Yes, Yes",
              description: "",
              symbol: {
                type: "esriSFS",
                style: "esriSFSSolid",

                color: [168, 112, 0, 255],
                outline: {
                  type: "esriSLS",
                  style: "esriSLSSolid",

                  color: [110, 110, 110, 255],
                  width: 0.4
                }
              }
            }
          ]
        },
        scaleSymbols: true,
        transparency: 0,
        brightness: 0,
        contrast: 0,
        labelingInfo: null
      },
      displayField: "FIELD_NAME",
      fields: [
        {
          name: "OBJECTID",
          type: "esriFieldTypeOID",
          alias: "OBJECTID"
        },
        {
          name: "Shape",
          type: "esriFieldTypeGeometry",
          alias: "Shape"
        },
        {
          name: "FIELD_KID",
          type: "esriFieldTypeString",
          alias: "FIELD_KID",
          length: 25
        },
        {
          name: "APPROXACRE",
          type: "esriFieldTypeDouble",
          alias: "APPROXACRE"
        },
        {
          name: "FIELD_NAME",
          type: "esriFieldTypeString",
          alias: "FIELD_NAME",
          length: 150
        },
        {
          name: "STATUS",
          type: "esriFieldTypeString",
          alias: "STATUS",
          length: 50
        },
        {
          name: "PROD_GAS",
          type: "esriFieldTypeString",
          alias: "PROD_GAS",
          length: 3
        },
        {
          name: "PROD_OIL",
          type: "esriFieldTypeString",
          alias: "PROD_OIL",
          length: 3
        },
        {
          name: "ACTIVEPROD",
          type: "esriFieldTypeString",
          alias: "ACTIVEPROD",
          length: 10
        },
        {
          name: "CUMM_OIL",
          type: "esriFieldTypeDouble",
          alias: "CUMM_OIL"
        },
        {
          name: "MAXOILWELL",
          type: "esriFieldTypeDouble",
          alias: "MAXOILWELL"
        },
        {
          name: "LASTOILPRO",
          type: "esriFieldTypeDouble",
          alias: "LASTOILPRO"
        },
        {
          name: "LASTOILWEL",
          type: "esriFieldTypeDouble",
          alias: "LASTOILWEL"
        },
        {
          name: "LASTODATE",
          type: "esriFieldTypeString",
          alias: "LASTODATE",
          length: 50
        },
        {
          name: "CUMM_GAS",
          type: "esriFieldTypeDouble",
          alias: "CUMM_GAS"
        },
        {
          name: "MAXGASWELL",
          type: "esriFieldTypeDouble",
          alias: "MAXGASWELL"
        },
        {
          name: "LASTGASPRO",
          type: "esriFieldTypeDouble",
          alias: "LASTGASPRO"
        },
        {
          name: "LASTGASWEL",
          type: "esriFieldTypeDouble",
          alias: "LASTGASWEL"
        },
        {
          name: "LASTGDATE",
          type: "esriFieldTypeString",
          alias: "LASTGDATE",
          length: 50
        },
        {
          name: "AVGDEPTH",
          type: "esriFieldTypeDouble",
          alias: "AVGDEPTH"
        },
        {
          name: "AVGDEPTHSL",
          type: "esriFieldTypeDouble",
          alias: "AVGDEPTHSL"
        },
        {
          name: "POLYDATE",
          type: "esriFieldTypeDate",
          alias: "POLYDATE",
          length: 8
        },
        {
          name: "FIELD_TYPE",
          type: "esriFieldTypeString",
          alias: "FIELD_TYPE",
          length: 5
        },
        {
          name: "FIELD_KIDN",
          type: "esriFieldTypeDouble",
          alias: "FIELD_KIDN"
        },
        {
          name: "Shape_Length",
          type: "esriFieldTypeDouble",
          alias: "Shape_Length"
        },
        {
          name: "Shape_Area",
          type: "esriFieldTypeDouble",
          alias: "Shape_Area"
        }
      ],
      relationships: [
        {
          id: 2,
          name: "Field 2 Wells",
          relatedTableId: 0
        }
      ],
      maxRecordCount: 1000,
      supportsStatistics: true,
      supportsAdvancedQueries: false,
      capabilities: "Map,Query,Data",
      supportedQueryFormats: "JSON",
      ownershipBasedAccessControlForFeatures: true
    }
  ],
  tables: [
    {
      id: 2,
      name: "KSTOPS",
      type: "Table",
      description: null,
      definitionExpression: "",
      hasAttachments: false,
      displayField: "KID",
      fields: [
        {
          name: "OBJECTID",
          type: "esriFieldTypeOID",
          alias: "OBJECTID"
        },
        {
          name: "KID",
          type: "esriFieldTypeString",
          alias: "KID",
          length: 255
        },
        {
          name: "API_NUMBER",
          type: "esriFieldTypeString",
          alias: "API_NUMBER",
          length: 255
        },
        {
          name: "API_NUM_NODASH",
          type: "esriFieldTypeString",
          alias: "API_NUM_NODASH",
          length: 255
        },
        {
          name: "LONGITUDE",
          type: "esriFieldTypeString",
          alias: "LONGITUDE",
          length: 255
        },
        {
          name: "LATITUDE",
          type: "esriFieldTypeString",
          alias: "LATITUDE",
          length: 255
        },
        {
          name: "ELEVATION",
          type: "esriFieldTypeString",
          alias: "ELEVATION",
          length: 255
        },
        {
          name: "ELEV_REF",
          type: "esriFieldTypeString",
          alias: "ELEV_REF",
          length: 255
        },
        {
          name: "FORMATION",
          type: "esriFieldTypeString",
          alias: "FORMATION",
          length: 255
        },
        {
          name: "TOP",
          type: "esriFieldTypeString",
          alias: "TOP",
          length: 255
        },
        {
          name: "BASE",
          type: "esriFieldTypeString",
          alias: "BASE",
          length: 255
        },
        {
          name: "SOURCE",
          type: "esriFieldTypeString",
          alias: "SOURCE",
          length: 255
        },
        {
          name: "UPDATED",
          type: "esriFieldTypeString",
          alias: "UPDATED",
          length: 255
        },
        {
          name: "KIDN",
          type: "esriFieldTypeInteger",
          alias: "KIDN"
        }
      ],
      relationships: [
        {
          id: 3,
          name: "Tops 2 Well",
          relatedTableId: 0
        }
      ],
      maxRecordCount: 1000,
      supportsStatistics: true,
      supportsAdvancedQueries: true,
      capabilities: "Map,Query,Data",
      supportedQueryFormats: "JSON"
    }
  ]
};
