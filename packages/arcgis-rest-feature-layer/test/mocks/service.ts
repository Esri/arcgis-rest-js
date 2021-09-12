/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ILayerDefinition,
  IFeatureServiceDefinition
} from "@esri/arcgis-rest-types";
import { cvdServiceFields } from "./fields.js";

export const getFeatureServerResponse: IFeatureServiceDefinition = {
  currentVersion: 10.21,
  serviceDescription: "Birds",
  hasVersionedData: false,
  supportsDisconnectedEditing: false,
  supportsReturnDeleteResults: true,
  supportsRelationshipsResource: true,
  syncEnabled: false,
  hasStaticData: false,
  maxRecordCount: 1000,
  supportedQueryFormats: "JSON",
  capabilities: "Query,Create,Delete,Update,Uploads,Editing",
  description: "",
  copyrightText: "",
  advancedEditingCapabilities: { supportsSplit: true },
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  initialExtent: {
    xmin: -118.016756138237,
    ymin: 32.8933824408207,
    xmax: -116.532738278622,
    ymax: 34.3261469363675,
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326
    }
  },
  fullExtent: {
    xmin: -117.855689264791,
    ymin: 32.5702577626442,
    xmax: -116.87086222794,
    ymax: 34.1460567673275,
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326
    }
  },
  allowGeometryUpdates: true,
  units: "esriDecimalDegrees",
  validationSystemLayers: {
    validationPointErrorlayerId: 1,
    validationLineErrorlayerId: 2,
    validationPolygonErrorlayerId: 3,
    validationObjectErrortableId: 5
  },
  extractChangesCapabilities: {
    supportsReturnIdsOnly: true,
    supportsReturnExtentOnly: false,
    supportsReturnAttachments: false,
    supportsLayerQueries: false,
    supportsSpatialFilter: false,
    supportsReturnFeature: false
  },
  syncCapabilities: {
    supportsASync: true,
    supportsRegisteringExistingData: true,
    supportsSyncDirectionControl: true,
    supportsPerLayerSync: true,
    supportsPerReplicaSync: false,
    supportsRollbackOnFailure: false,
    supportedSyncDataOptions: 3
  },
  editorTrackingInfo: {
    enableEditorTracking: false,
    enableOwnershipAccessControl: false,
    allowOthersToUpdate: true,
    allowOthersToDelete: false
  },
  layers: [
    {
      id: 0,
      name: "Sitings",
      parentLayerId: -1,
      defaultVisibility: true,
      minScale: 0,
      maxScale: 0,
      geometryType: "esriGeometryPoint"
    },
    {
      id: 1,
      name: "NestingGrounds",
      parentLayerId: -1,
      defaultVisibility: true,
      minScale: 0,
      maxScale: 0,
      geometryType: "esriGeometryPolygon"
    },
    {
      id: 2,
      name: "LandCover",
      parentLayerId: -1,
      defaultVisibility: true,
      minScale: 0,
      maxScale: 0,
      geometryType: "esriGeometryPolygon"
    }
  ],
  tables: [],
  relationships: [
    {
      id: 0,
      name: "county_division",
      backwardPathLabel: "belongs",
      originLayerId: 0,
      originPrimaryKey: "GlobalID",
      forwardPathLabel: "has",
      destinationLayerId: 2,
      originForeignKey: "GlobalID_sor",
      relationshipTableId: 3,
      destinationPrimaryKey: "GlobalID",
      destinationForeignKey: "GlobalID_des",
      rules: [
        {
          ruleID: 1,
          originSubtypeCode: 1,
          originMinimumCardinality: 0,
          originMaximumCardinality: 2,
          destinationSubtypeCode: 0,
          destinationMinimumCardinality: 0,
          destinationMaximumCardinality: 1
        }
      ],
      cardinality: "esriRelCardinalityOneToMany",
      attributed: false,
      composite: true
    }
  ],
  isLocationTrackingService: true,
  isLocationTrackingView: true
};

export const getFeatureServiceResponse: ILayerDefinition = {
  currentVersion: 10.6,
  id: 0,
  name: "Service Requests",
  parentLayerId: -1,
  defaultVisibility: true,
  minScale: 0,
  maxScale: 0,
  type: "Feature Layer",
  geometryType: "esriGeometryPoint",
  description:
    "A request for service or incident reported by the general public or other interested party",
  copyrightText: "",
  editFieldsInfo: null,
  ownershipBasedAccessControlForFeatures: null,
  syncCanReturnChanges: false,
  relationships: [
    {
      id: 0,
      name: "ss6.gdb.ServiceRequestComment",
      relatedTableId: 1,
      cardinality: "esriRelCardinalityOneToMany",
      role: "esriRelRoleOrigin",
      keyField: "requestid",
      composite: true
    }
  ],
  isDataVersioned: false,
  supportsRollbackOnFailureParameter: false,
  archivingInfo: {
    supportsQueryWithHistoricMoment: false,
    startArchivingMoment: -1
  },
  supportsStatistics: true,
  supportsAdvancedQueries: true,
  supportsValidateSQL: true,
  supportsCalculate: true,
  advancedQueryCapabilities: {
    supportsPagination: true,
    supportsTrueCurve: true,
    supportsQueryWithDistance: true,
    supportsReturningQueryExtent: true,
    supportsStatistics: true,
    supportsOrderBy: true,
    supportsDistinct: true,
    supportsSqlExpression: true
  },
  editingInfo: {
    lastEditDate: new Date().getTime()
  },
  extent: {
    xmin: -1.4842597721444273e7,
    ymin: -7250478.783951572,
    xmax: -4823845.204923232,
    ymax: 1.3760961797220282e7,
    spatialReference: {
      wkid: 102100,
      latestWkid: 3857
    }
  },
  drawingInfo: {
    renderer: {
      type: "uniqueValue",
      field1: "status",
      field2: null,
      field3: null,
      defaultSymbol: null,
      defaultLabel: null,
      uniqueValueInfos: [
        {
          symbol: {
            type: "esriPMS",
            url: "503e8080ea4466250bb86ab805526668",
            imageData:
              "iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAA+NJREFUOI211V9IW1ccwPHvvTd3iYnx/7BBsRPihObBSIJBO6l1LWipy1pBZH0SYWWjhbUPlZRaWHENvvSpc7BRSukenIwWKa0rpamta0Uw4EsmoYLW6qITTaIxJpp77x5sbUOtFcZ+T+cfn3POjx/n6PifQrfT5D+Qm4Jjot3ewsaGVUulsgUIA3+pweBvAvRbIL5rOABSnsXSoUAnoZBBHR9H2r8fKTcXdXGxQBkeLgPclJdHQgsL5yxLS798EJ6FLMnhGFD9/hrp8GEyOzsxlJYi6vVba5R4nMTz58R6e3PUYPDnOZutQR8IfJULyW3hKdBJLtdDdWTEafR4yKqvR5Ckd24kGY2YKirI2LePaH8/iZ6e40mHoxe//9i2sKG21qsODTlN58+TdegQAOraGqtjYyRHR1Hm59EVF6N3OjFWVCDKMjnNzUSARE/Pl3M22zd7AoGf0uC/YY82MfGdrqkJ88GDAKzPzxPu7kYdG9vafB1Y7+sjXl9P3unT6LKzyXa7Wff70SKR7hDcsEB8C5bq6r5VBgd1mW43giShrK4S7upCDQTeSQWA4vOxBBR0dCDKMpmtrSyfOWMWrNbjTEz8+iYVstwq7N2LoaQEgNWRkfeib+PxhgYynU4MZWUs6/VIZWXtabC2sFAkV1cj6DaHEo8f74i+juToKJlOJ5LRiFRdjZZMfpqWY2162iC6XK86GsrQ0K7g1MzMVlvMz0eZmTGnwUJJyYa6srJZrIKA6HCg+v0fhKXCwq22Gg4jZGWtpcGixbK04fdbtLY2BEnCUF9PfBew3uncRJNJlKdPkY8eDaXBUmGhLzUwcCI5O4uhpARTTQ1rFgtaKPReVLTbMdntACQmJyGZRDAaf0+D1VDoByEv78TqvXsYTp7crM+uLqIXLmyLizYbuR0diBkZaIpC7PZthPJyRb1588c0+OP798cX29sHk9eu1a1UVmJ2ucgoLUXu6WH12TMSPh+q349UW4vhwAFMLheSyQTAss+H8uAB+ra2G/nBYDgNBtDm5prkpqbZmMeThdeLuapq8+SNjWQ3NoKmgSC8Wa8orDx6RNzrRW5pmZ67fv3r13NpcMHdu7HI2bNVuN2jMY8nc72lBdORI+iLijYfo1eolkqRmJ4m1t9P6s4dPmptnQMqbaBsCwPkXLkSjHg8xWJx8cP1W7cc4b4+hPJyZIcD0WxGjUbZGB5Ge/ECwWrVMk6d+iN69eoXn0DqbWfbhz7H640CzuilS5+pkcj3qZcvq1JTU0ZtclIUrFZFrq5ekZqbnwgGw7mcy5eD2xk7fk3ZFy/+CXyeNrhD+e0a/i/xL6dZgxFzQIDxAAAAAElFTkSuQmCC",
            contentType: "image/png",
            width: 16,
            height: 16,
            angle: 0,
            xoffset: 0,
            yoffset: 0
          },
          value: "Unassigned",
          label: "Unassigned",
          description: ""
        },
        {
          symbol: {
            type: "esriPMS",
            url: "00591bb6a81be2ce27412c3521fc5c66",
            imageData:
              "iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAA8pJREFUOI211W9oG2UcB/Dv3XOXuySXJk3aNbe1a0sTMxmWbi0dyl4URRioqx1TRyeoKAOFib6Z+MIXvpDhaxGhDraCjI0KUkEmlo0gQ9hwMCqti422zWyTluXSNJf0/j6PL7rFHku7gfiDg4d7Hj7P7/f8jucE/E8h7DS5eh7NjoURnnS+ClgJBjPMcVIJDLPUzV/mLEyqp1F7bHhmDCTKSx+5Nj4BTJm6iyBSCkRUQG29xbUySQDD8EfX8ue0M+o7+PqR8NIFNBFXvUKd/DNETkHpOAy5uQ28INbXuLYFQ1uGnktHqK2NFc6pR6RKfrT5Q5gN4YWzEAhVr1InPxCID6Opuxccxz9UERF9CLZ1wd/yOsrZmzCKU8fMcOclYHGkISzHO89Sa3EgqA6jqbsPAEAdC9XCPMziHFy7DEGKQWpJILCrCzwREEk9jbUMYBSnXi6cj74bf0v7ygMvjyHO7MoHQqAPoa5eAIBVKaF0ZxLUXqxvbllZWJUbqC2nEN1/FIIcQDgxCGv9DzDX+jz/BcbV06jVYeJLvOeaWUHZexwcx8O1TJRmJ0DdfIP2Aq6ZgTbzPVr6joMnApS9Q1j/czzE+dVjQP6bLUdBTnBcFHJzGwCgupzZFt2K11YXoKgJyNHdWP8LIGLb2x6Yuet7RCVZb5ZR/G1H9EGY97JQ1ASI6APxpcCY/oTnjJmrybz45JZsso8FO2axPuZFBa55L+SBORK1qWNI/y7q9DRtuyBiuD6mtg6Olzc8MO+LanZ1XmWMguN4yNFe1FYeDUux5Cbq2HDNDMRgf94DE1/rNac2c9IsFyFHWhHcsw8bqz+BMXMbcrOqYLwbAGCUVu5XLn3rgalR+YzjpJPVu7cgR45sfp+pN1HOXGiI80RF875h8IIPjFHod6+DI6pLjV++9MCtb9z6vXh5KG2upYcqf/cg1J6EPxqHeOB9VJfuwNCmQe1FECkBOfYUgrtTIL7NlqzPT8M1MpAiQ+Ox1/IlDwwArJx+SQz0Lem5i03AKELtyc3Mew4i3HPwoawZo6gsTKNWmIQY6s8VyulTD+Y8cMsp6GvfqYPg7F/13EXFKh1CsKMfUjjmuYwYozBKK9BzN+HUbsOnHCogQA7sH4XbEAaAyMiVzNqlZ9v5WPtVS0v3l2ZvgCMqxGA3eEEGtauw9TkwpoEjUeaPPf9jeW7qaNfHcLY6DS/6yIlrZQAD5R9eOUwt/VNnQxt0jKUAsws85+twRSVZIf5dP3OifCby4kSmkbHjryn8wsR1AM9532bvPzvHjvB/iX8A1b6J7VdrDTIAAAAASUVORK5CYII=",
            contentType: "image/png",
            width: 16,
            height: 16,
            angle: 0,
            xoffset: 0,
            yoffset: 0
          },
          value: "Assigned",
          label: "Assigned",
          description: ""
        },
        {
          symbol: {
            type: "esriPMS",
            url: "cd72b6fbdc1352015a7112f734f28806",
            imageData:
              "iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAABDpJREFUOI211VtM01ccB/Bv++feYikUuoKWlqvAQqmlYiHEFSgCkWHCZLppFjCLwekiYR1DWXaDEOKYDzr2QMgu4MIkCyDKgHIZ2aCClIvKihSllEEtLRak3Ayle9hoaAZIsuz3dHLOL59zzfnZ4X8Ku50GGwdKgqYNC5c1Om28ft5AN5rmHdxdaatebp6GfUzvRm9Pr8+Sw8/rdg3L1JVOT0aUt6/V/xCnMg2THMmO4HnGgEn3gNY4a9c23kQxW1az+YzYsxWyj3/KSvj8bRKJZNkRvvPgK05nZ2t/9YPv6SKWBDlvvIdgPy6cnB2tOYuLS/hjVIXypmpycfMXJ3XPDNF1/WURxw6cm9sSlo1ec2nv7h2oeVjplpuQj7SEOBAE8a8dUSguEPJ54IWFoupWPSp6ynyzkD1osVi4Gyu3gUdVGlnNw0q3DyWXkJaYAABYXl5Gl2IQ8uE+aI06sD33IiY8ElE8Hhwc7JGZng4AqOgp82W6M24AeMsGvtP3paD0Vnl0HDsVR+PFAICpaR0uV5RA9XzQOvnQLNAwchMHO+NQcOYCPOg0nHo9DXdVCjQpfn1TNvjNRUlE9owVnjQYijRLj/BJkhQEQcBkWkR+eSEem4a3ul/06tpRWAGUvJ8HBwd7vJt0Ahd/zCFrZsWfAjhnhR9PaUQsJ18EcNkAgI67Pduim/GeoSTECiMRGhQIguSISd10is1RqPWTVCFHBDu7v7uaFZ07ohvRdb8PscJIUCgu4DFEmJnTM2xgzfMxMp8bCgCwWCwYMPy2K1ij/9PaZtE9oDPOOtrA3lTu+tziAhkASCQSQugCKI2Kl8IsOtPa1s8bQafSXtjAHC+f5YEJBcVszgRBEEiMiIOy4+WwKCwSALCyvIohfRfSw08ZbeAAlm9/w0hNrHpyCv4cNhJE0ajqYmH2hXZbNHBPBGIEEQCAR0/Gsbq+CjaT1WYDv+LFLKTZs5pr2hqRl3UW7nQarmQWQvptwZa4PzUMRWfy4OzsDLPZjMrmWgRSwyzeDNciGzhdKG25Wpej/Pr3qyFRcj7E0VEIDuDiuw/K0CrvRstgO5RGBfiMWBwRHIb4UBSoVAoAoL61HXKtDNKEj9pS+HmjNjAA7PfzFx/RpasLavOdClGM10QH4U6nISMlGRkpybBYLCCRSNZ8s9mM220dKG0txonwd5757Q9L3RizgZPDz+vqBkoPA+gsqM13SlVm4Hh8Cjj7fEAQhBVdW1vD2LgGN5rq0a5pwPFXT8+J+DyBhHN6ZUsYAI7xc3t/uX+dE8Bkd1T1VIc0jNwElxIMvq8AbhRXGBbmcU8th3ZlAmyXYOSIpd1BgWyJJOjC0mZny4/+n6oQ+vO9K4lPZ3QFY9qJA6qnaudp0ziZvSdg/RA3xuTvc1K+18Pz0lFhbv9Wxo6lKV0obQHQsrmvB9s/v13D/yX+AiKnlMyVeu3hAAAAAElFTkSuQmCC",
            contentType: "image/png",
            width: 16,
            height: 16,
            angle: 0,
            xoffset: 0,
            yoffset: 0
          },
          value: "Closed",
          label: "Closed",
          description: ""
        }
      ],
      fieldDelimiter: ","
    },
    transparency: 0,
    labelingInfo: null
  },
  hasM: false,
  hasZ: false,
  allowGeometryUpdates: true,
  allowTrueCurvesUpdates: false,
  onlyAllowTrueCurveUpdatesByTrueCurveClients: true,
  hasAttachments: true,
  supportsAttachmentsByUploadId: true,
  supportsApplyEditsWithGlobalIds: false,
  htmlPopupType: "esriServerHTMLPopupTypeAsHTMLText",
  objectIdField: "objectid",
  globalIdField: "globalid",
  displayField: "name",
  typeIdField: "status",
  subtypeField: "",
  fields: cvdServiceFields,
  indexes: [
    {
      name: "i99requestid",
      fields: "requestid",
      isAscending: true,
      isUnique: false,
      description: ""
    },
    {
      name: "a11_ix1",
      fields: "shape",
      isAscending: true,
      isUnique: true,
      description: ""
    }
  ],
  dateFieldsTimeReference: {
    timeZone: "UTC",
    respectsDaylightSaving: false
  },
  types: [
    {
      id: "Unassigned",
      name: "Unassigned",
      domains: {
        requesttype: { type: "inherited" },
        status: { type: "inherited" }
      },
      templates: [
        {
          name: "Unassigned",
          description: "",
          prototype: {
            attributes: {
              requestdate: null,
              floor: null,
              requestid: null,
              requesttype: null,
              comments: null,
              name: null,
              phone: null,
              email: null,
              status: "Unassigned",
              building: null
            }
          },
          drawingTool: "esriFeatureEditToolPoint"
        }
      ]
    },
    {
      id: "Assigned",
      name: "Assigned",
      domains: {
        requesttype: { type: "inherited" },
        status: { type: "inherited" }
      },
      templates: [
        {
          name: "Assigned",
          description: "",
          prototype: {
            attributes: {
              building: null,
              floor: null,
              requestid: null,
              requesttype: null,
              comments: null,
              name: null,
              phone: null,
              email: null,
              requestdate: null,
              status: "Assigned"
            }
          },
          drawingTool: "esriFeatureEditToolPoint"
        }
      ]
    },
    {
      id: "Closed",
      name: "Closed",
      domains: {
        requesttype: { type: "inherited" },
        status: { type: "inherited" }
      },
      templates: [
        {
          name: "Closed",
          description: "",
          prototype: {
            attributes: {
              building: null,
              floor: null,
              requestid: null,
              requesttype: null,
              comments: null,
              name: null,
              phone: null,
              email: null,
              requestdate: null,
              status: "Closed"
            }
          },
          drawingTool: "esriFeatureEditToolPoint"
        }
      ]
    }
  ],
  templates: [],
  maxRecordCount: 1000,
  supportedQueryFormats: "JSON, AMF, geoJSON",
  capabilities: "Create,Delete,Query,Update,Uploads,Editing",
  useStandardizedQueries: true
};
