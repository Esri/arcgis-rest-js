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

Remove support for `rawResponse` across REST JS and update packages to use new `IRequestOptions` shape.

## Summary

This change drops support for `rawResponse` from all packages, updates all packages to use the new `IRequestOptions` v5 shape, and adds new or replacement methods to support fetching raw requests.

- `rawResponse` support removed from `IRequestOptions` and methods in REST JS.
- `request` method now returns JSON only. Non-JSON data can be fetched using `rawRequest()` and implementing wrapper methods that invoke it.
- Added `queryFeaturesRaw()` and `getItemDataRaw()` to provide `rawResponse` functional equivalence.

## Breaking Changes

- `getFeature()` no longer supports `rawResponse`.
- `bulkGeocode()` no longer supports `rawResponse`.
- `geocode()` no longer supports `rawResponse`.
- `queryFeatures()` can no longer be used with `f=pbf` to query features as raw pbf.
- `getItemData()` no longer supports raw, file, or binary responses, use `getItemDataRaw()` instead. deprecated `IItemDataOptions` since we no longer support the `file` property in `getItemData()`. Use `getItemDataRaw()` to get the native response instead and process result accordingly.
- `getItemInfo()` no longer supports `rawResponse` as an option and uses `rawRequest()` as default behavior.
- `getItemResource()` no longer supports `rawResponse` as an option and uses `rawRequest()` as default behavior.

## Migration Guide

- For REST JS methods that no longer support `rawResponse` without replacement, construct a wrapper method using `rawRequest()` or create an issue in https://github.com/Esri/arcgis-rest-js/issues to request official support.
- For querying features as `pbf`, use `queryFeaturesRaw()` and supply `f=pbf` in the query options.
- For querying a raw, file, or binary response from an item, use `getItemDataRaw()` to fetch the native Response object and handle it accordingly.
