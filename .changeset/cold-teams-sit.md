---
"@esri/arcgis-rest-basemap-sessions": major
"@esri/arcgis-rest-developer-credentials": major
"@esri/arcgis-rest-elevation": major
"@esri/arcgis-rest-feature-service": major
"@esri/arcgis-rest-geocoding": major
"@esri/arcgis-rest-places": major
"@esri/arcgis-rest-portal": major
"@esri/arcgis-rest-request": major
---

remove support for rawResponse and update packages to new IRequestOptions shape

### Summary

This change drops support for `rawResponse` from all packages, updates all packages to use the new `IRequestOptions` shape, and adds support for raw requests with new methods.

- `rawResponse` support removed from REST JS
- fetch methods now return JSON only. Non-JSON data can be fetched using `rawRequest()` or new wrapper methods that implement it.
- added `queryFeaturesRaw()` and `getItemDataRaw()`
- converted all `httpMethod` instances to the new `fetchOptions.method`

### Why these changes were made

- REST JS methods are being moved to return JSON only in most cases.
- Generic types will be easier to implement and improve our TypeScript commitment.
- Improve API surface area and our testing landscape.
- Separate default function from more advanced uses.

### Breaking Changes

- `getFeature()` no longer supports raw response.
- `queryFeatures()` can no longer be used to query features as pbf with `f=pbf`.
- `bulkGeocode()` no longer supports raw response.
- `geocode()` no longer supports raw response.
- `getItemData()` no longer supports raw, file, or binary responses, use `getItemDataRaw()` instead.
  deprecated IItemDataOptions since we don't support the file property in getItemData() anymore. Use getItemDataRaw() to get the native response instead.
- `getItemInfo()` no longer supports rawResponse as an option and uses rawRequest() as default behavior.
- `getItemResource()` no longer supports rawResponse as an option and uses rawRequest() as default behavior.

### Migration guide

- To get a raw response, construct your own request and use `rawRequest()` to fetch a native response.
- For querying features as `pbf`, use `queryFeaturesRaw()` and supply `f=pbf` in the query options.
- To manually set an HTTP method, supply `fetchOptions.method` in IRequestOptions instead of top-level `httpMethod`.
