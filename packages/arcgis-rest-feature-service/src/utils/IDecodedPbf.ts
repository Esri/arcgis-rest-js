export interface IDecodedPbf {
  featureCollection: {
    type: "FeatureCollection";
    features: GeoJSON.Feature[];
  };
  exceededTransferLimit?: boolean;
}
