/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { IFeatureSet } from "@esri/arcgis-rest-types";

const ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver"
export const ARCGIS_ONLINE_GEOENRICHMENT_URL = `${ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL}/Geoenrichment`;
export const ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL = `${ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL}/StandardGeographyQuery`;

export interface IEndpointOptions extends IRequestOptions {
  /**
   * Any ArcGIS Geoenrichment service (example: https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment )
   */
  endpoint?: string;
}

export interface IGeoenrichmentResult {
  paramName: string;
  dataType: string;
  value: {
    version: string;
    FeatureSet: IFeatureSet;
  };
}