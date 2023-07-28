/**
 * Used to describe privilege list of an app.
 */
export enum Privileges {
  Basemaps = "portal:apikey:basemaps",
  Demographics = "premium:user:demographics",
  Elevation = "premium:user:elevation",
  FeatureReport = "premium:user:featurereport",
  Geocode = "premium:user:geocode",
  GeocodeStored = "premium:user:geocode:stored",
  GeocodeTemporary = "premium:user:geocode:temporary",
  GeoEnrichment = "premium:user:geoenrichment",
  NetworkAnalysis = "premium:user:networkanalysis",
  NetworkAnalysisRouting = "premium:user:networkanalysis:routing",
  NetworkAnalysisOptimizedRouting = "premium:user:networkanalysis:optimizedrouting",
  NetworkAnalysisClosestFacility = "premium:user:networkanalysis:closestfacility",
  NetworkAnalysisServiceArea = "premium:user:networkanalysis:servicearea",
  NetworkAnalysisLocationalLocation = "premium:user:networkanalysis:locationallocation",
  NetworkAnalysisVehicleRouting = "premium:user:networkanalysis:vehiclerouting",
  NetworkAnalysisOriginDestinationCostMatrix = "premium:user:networkanalysis:origindestinationcostmatrix",
  Places = "premium:user:places",
  SpatialAnalysis = "premium:user:spatialanalysis",
  GeoAnalytics = "premium:publisher:geoanalytics",
  RasterAnalysis = "premium:publisher:rasteranalysis"
}
