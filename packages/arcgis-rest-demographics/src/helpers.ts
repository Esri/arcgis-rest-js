/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IFeatureSet } from "@esri/arcgis-rest-types";

const ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver"
export const ARCGIS_ONLINE_GEOENRICHMENT_URL = `${ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL}/Geoenrichment`;
export const ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL = `${ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL}/StandardGeographyQuery`;


export interface IGeoenrichmentResult {
  paramName: string;
  dataType: string;
  value: {
    version: string;
    FeatureSet: IFeatureSet;
  };
}