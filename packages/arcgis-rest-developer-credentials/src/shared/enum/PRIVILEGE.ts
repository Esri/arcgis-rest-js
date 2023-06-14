/* TODO: - Some special privileges depends on itemID, which is not implemented yet
 *       - e.g. portal:app:access:item:{itemId}
 */
export enum Privileges {
  "portal:apikey:basemaps" = "portal:apikey:basemaps",
  "premium:user:demographics" = "premium:user:demographics",
  "premium:user:elevation" = "premium:user:elevation",
  "premium:user:featurereport" = "premium:user:featurereport",
  "premium:user:geocode" = "premium:user:geocode",
  "premium:user:geocode:stored" = "premium:user:geocode:stored",
  "premium:user:geocode:temporary" = "premium:user:geocode:temporary",
  "premium:user:geoenrichment" = "premium:user:geoenrichment",
  "premium:user:networkanalysis" = "premium:user:networkanalysis",
  "premium:user:networkanalysis:routing" = "premium:user:networkanalysis:routing",
  "premium:user:networkanalysis:optimizedrouting" = "premium:user:networkanalysis:optimizedrouting",
  "premium:user:networkanalysis:closestfacility" = "premium:user:networkanalysis:closestfacility",
  "premium:user:networkanalysis:servicearea" = "premium:user:networkanalysis:servicearea",
  "premium:user:networkanalysis:locationallocation" = "premium:user:networkanalysis:locationallocation",
  "premium:user:networkanalysis:vehiclerouting" = "premium:user:networkanalysis:vehiclerouting",
  "premium:user:networkanalysis:origindestinationcostmatrix" = "premium:user:networkanalysis:origindestinationcostmatrix",
  "premium:user:places" = "premium:user:places",
  "premium:user:spatialanalysis" = "premium:user:spatialanalysis",
  "premium:publisher:geoanalytics" = "premium:publisher:geoanalytics",
  "premium:publisher:rasteranalysis" = "premium:publisher:rasteranalysis"
}
