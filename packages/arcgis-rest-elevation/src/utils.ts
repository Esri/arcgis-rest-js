export const baseUrl =
  "https://elevation-api.arcgis.com/arcgis/rest/services/elevation-service/beta";

export function isValidLongitude(lon: number): boolean {
  return lon >= -179.99 && lon <= 179.99;
}

export function isValidLatitude(lat: number): boolean {
  return lat >= -85.05 && lat <= 85.05;
}
