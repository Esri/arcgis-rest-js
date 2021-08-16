/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ISpatialReference, IExtent } from "./geometry";
import { ILayerDefinition, ITable } from "./webmap";

/**
 * `IFeatureServiceDefinition` can also be imported from the following packages:
 *
 * ```js
 * import { IFeatureServiceDefinition } from "@esri/arcgis-rest-service-admin";
 * import { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-layer";
 * ```
 */
export interface IFeatureServiceDefinition {
  currentVersion?: number;
  serviceDescription: string;
  hasVersionedData: boolean;
  supportsDisconnectedEditing: boolean;
  supportsReturnDeleteResults: boolean;
  /** Boolean value indicating whether data changes. True if it does not. */
  hasStaticData?: boolean;
  /** Numeric value indicating tbe maximum number of records that will be returned at once for a query. */
  maxRecordCount: number;
  /** String value indicating the output formats that are supported in a query. */
  supportedQueryFormats: string;
  supportsRelationshipsResource: boolean;
  /** A comma separated list of supported capabilities, e.g. Query,Editing. */
  capabilities: string;
  /** String value of the layer as defined in the map service. */
  description: string;
  /** String value for the copyright text information for the layer. */
  copyrightText: string;
  advancedEditingCapabilities: { [key: string]: boolean };
  /** An object containing the WKID or WKT identifying the spatial reference of the layer's geometry. */
  spatialReference: ISpatialReference;
  initialExtent: IExtent;
  fullExtent: IExtent;
  /** Boolean value indicating whether the geometry of the features in the layer can be edited. */
  allowGeometryUpdates: boolean;
  units: string;
  syncEnabled: boolean;
  returnServiceEditsHaveSR?: boolean;
  validationSystemLayers: {
    validationPointErrorlayerId: number;
    validationLineErrorlayerId: number;
    validationPolygonErrorlayerId: number;
    validationObjectErrortableId: number;
  };
  extractChangesCapabilities: {
    supportsReturnIdsOnly: boolean;
    supportsReturnExtentOnly: boolean;
    supportsReturnAttachments: boolean;
    supportsLayerQueries: boolean;
    supportsSpatialFilter: boolean;
    supportsReturnFeature: boolean;
  };
  syncCapabilities: {
    supportsASync: boolean;
    supportsRegisteringExistingData: boolean;
    supportsSyncDirectionControl: boolean;
    supportsPerLayerSync: boolean;
    supportsPerReplicaSync: boolean;
    supportsRollbackOnFailure: boolean;
    supportedSyncDataOptions: number;
  };
  editorTrackingInfo: {
    enableEditorTracking: boolean;
    enableOwnershipAccessControl: boolean;
    allowOthersToUpdate: boolean;
    allowOthersToDelete: boolean;
  };
  documentInfo?: { [key: string]: string };
  // the feature layers published by this service
  layers: ILayerDefinition[];
  // the non-spatial tables published by this service
  tables: ITable[];
  relationships: [
    {
      id: number;
      name: string;
      backwardPathLabel: string;
      originLayerId: number;
      originPrimaryKey: string;
      forwardPathLabel: string;
      destinationLayerId: number;
      originForeignKey: string;
      relationshipTableId: number;
      destinationPrimaryKey: string;
      destinationForeignKey: string;
      rules: [
        {
          ruleID: number;
          originSubtypeCode: number;
          originMinimumCardinality: number;
          originMaximumCardinality: number;
          destinationSubtypeCode: number;
          destinationMinimumCardinality: number;
          destinationMaximumCardinality: number;
        }
      ];
      cardinality:
        | "esriRelCardinalityOneToOne"
        | "esriRelCardinalityOneToMany"
        | "esriRelCardinalityManyToMany";
      attributed: boolean;
      composite: boolean;
    }
  ];
  enableZDefaults?: boolean;
  isLocationTrackingService: boolean;
  isLocationTrackingView: boolean;
  zDefault?: number;
}
/**
 * Very generic structure representing the return value from the
 * /arcgis/rest/admin/services/<service-name>/FeatureServer?f=json response
 */
export interface IServiceInfo extends Record<string, unknown> {
  adminServiceInfo: {
    name: string;
    type: string;
    status: string;
    database: {
      datasource: {
        name: string;
      };
    };
  };
  layers: Record<string, unknown>[];
}

/**
 * Individual View Source entry
 */

export interface IViewServiceSource {
  name: string;
  type: string;
  url: string;
  serviceItemId: string;
}
/**
 * Response from the /sources end-point of a view service
 */
export interface IViewServiceSources {
  currentVersion: number;
  services: IViewServiceSource[];
}

/**
 * Response from the portals/Self/isServiceNameAvailable request
 */
export interface IServiceNameAvailable {
  available: boolean;
}
