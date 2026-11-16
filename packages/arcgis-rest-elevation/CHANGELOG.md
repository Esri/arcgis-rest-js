# @esri/arcgis-rest-elevation Changelog

## 5.0.0

### Major Changes

- d9dc227: ## Summary

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

### Patch Changes

- Updated dependencies [d9dc227]
  - @esri/arcgis-rest-request@5.0.0

## 4.11.1

### Patch Changes

- 1c0d7e5: Added native `FormData` support for Node versions 22 and 24.

## 4.11.0

## 4.10.3

## 4.10.2

## 4.10.1

## 4.10.0

## 4.9.1

## 4.9.0

## 4.8.0

### Minor Changes

- 93db38b: Initial bump to migrate to changesets.

## @esri/arcgis-rest-elevation 1.0.0 (2025-01-30)

### Features

- **arcgis-rest-elevation:** initial release of elevation package ([#1191](https://github.com/Esri/arcgis-rest-js/issues/1191)) ([0d2064c](https://github.com/Esri/arcgis-rest-js/commit/0d2064cea4760a9f280672893b4c2255c8d2ec1e))
