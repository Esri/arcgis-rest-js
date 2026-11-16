---
"@esri/arcgis-rest-developer-credentials": major
"@esri/arcgis-rest-basemap-sessions": major
"@esri/arcgis-rest-feature-service": major
"@esri/arcgis-rest-demographics": major
"@esri/arcgis-rest-elevation": major
"@esri/arcgis-rest-geocoding": major
"@esri/arcgis-rest-request": major
"@esri/arcgis-rest-routing": major
"@esri/arcgis-rest-places": major
"@esri/arcgis-rest-portal": major
"@esri/arcgis-rest-auth": major
---

## Summary

- Removed support for `rawResponse` from REST JS.
- Removed support for non-JSON `f` query types from `request()`.
- Removed `arcgis-rest-fetch` and `arcgis-rest-form-data` compatibility packages. Upgraded REST JS to support Node version 22 and above.
- Removed `withOptions()` from `arcgis-rest-request`.
- Deprecated `rawResponse` from `request()`
- Deprecated `hideToken` from `request()`.
- Deprecated `maxUrlLength` from `request()`.
- Deprecated and removed `request` property from `IRequestOptions`.
- Deprecated `appendCustomParams()` utility method.
- Added `rawRequest()` to fetch the native `Response` object or non-JSON data that users can process for custom behavior.
- Added `processOptions()` to replace `appendCustomParams()`.
- Added `queryFeaturesRaw()` and `getItemDataRaw()` to provide `rawResponse` functional equivalence.

Added `IRequestFlags` to customize the `request()` method:

- Removed `maxUrlLength` behavior. Migrate to `requestFlags.ignoreMaxUrlLength` which will allow user to enforce custom limits within fetch.
- Removed `hideToken` behavior. Use `requestFlags.useAuthorizationHeader` or `requestFlags.useXEsriAuthorizationHeader`
- Deprecated `suppressWarnings`. Use `requestFlags.suppressWarnings`.
- Added `useAuthorizationHeader` property to `IRequestFlags`.
- Added `useXEsriAuthorizationHeader` property to `IRequestFlags`.

Web API Fetch options are moved under `fetchOptions`:

- `httpMethod` is deprecated. Use `fetchOptions.method`.
- `credentials` is deprecated. Use `fetchOptions.credentials`.
- `headers` is deprecated. Use `fetchOptions.headers`.
- `signal` is deprecated. Use `fetchOptions.signal`.

## Bugfixes

- Fixed issue with `findElevationAtManyPoints` where coordinates were not being passed consistently.

For more complete information and full migration guide to REST JS v5 go to https://developers.arcgis.com/arcgis-rest-js/release-notes/v5-release-notes/
