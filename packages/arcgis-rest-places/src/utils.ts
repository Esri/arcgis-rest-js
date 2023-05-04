export const baseUrl =
  "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1";

export function hasNextPage(response: any) {
  return !!response?.links?.next;
}

export function getNextPageParams(currentOffset = 0, currentPageSize = 10) {
  return {
    offset: currentOffset + currentPageSize,
    pageSize: currentPageSize
  };
}
