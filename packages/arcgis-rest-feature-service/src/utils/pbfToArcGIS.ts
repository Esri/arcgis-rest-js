import { geojsonToArcGIS } from "@terraformer/arcgis";
import { pbfToGeoJSON } from "./pbfToGeoJSON.js";

export interface IPbfToArcGIS {
  features: any;
  exceededTransferLimit?: boolean;
}

export const pbfToArcGIS = (arrayBuffer: ArrayBuffer): IPbfToArcGIS => {
  // convert pbf array buffer to geojson structure
  const decoded = pbfToGeoJSON(arrayBuffer);
  const featureCollection: GeoJSON.FeatureCollection = {
    type: decoded.featureCollection.type,
    features: decoded.featureCollection.features as GeoJSON.Feature[]
  };
  // send geojson structure to terraformer for conversion to arcgis json
  const arcgis = geojsonToArcGIS(featureCollection);
  return {
    features: arcgis,
    exceededTransferLimit: decoded.exceededTransferLimit
  };
};
