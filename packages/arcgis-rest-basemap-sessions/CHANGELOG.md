# @esri/arcgis-rest-basemap-sessions Changelog

## 5.0.0

### Major Changes

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

### Bugfixes

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

## @esri/arcgis-rest-basemap-sessions [1.1.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-basemap-sessions@1.0.0...@esri/arcgis-rest-basemap-sessions@1.1.0) (2025-08-20)

### Features

- **arcgis-rest-basemap-styles:** improve method names, edge cases and error handling ([d866803](https://github.com/Esri/arcgis-rest-js/commit/d8668032510f76d16d034f6e93d5347465d57e44))

## @esri/arcgis-rest-basemap-sessions 1.0.0 (2025-08-11)

### Bug Fixes

- **arcgis-rest-basemap-sessions:** improve logic for duration and safetyMargin ([9384113](https://github.com/Esri/arcgis-rest-js/commit/9384113963094b2a1b716bb473e0762da0d0b789))
- **arcgis-rest-basemap-sessions:** wrap up work before removing local options ([f5d5c60](https://github.com/Esri/arcgis-rest-js/commit/f5d5c604c1c192ce1edda0ac63392cb7c51bb912))

### Features

- **arcgis-rest-basemap-sessions:** add basemap style sessions package ([ec63c02](https://github.com/Esri/arcgis-rest-js/commit/ec63c02ee10384f15fce8a602a53922dabb09c6b))
- **arcgis-rest-basemap-sessions:** remove static basemap tiles ([7c1ec7f](https://github.com/Esri/arcgis-rest-js/commit/7c1ec7f35da90864b4d27aa1c3e6f93f53e0a41f))
- add basemap session package ([b8848e1](https://github.com/Esri/arcgis-rest-js/commit/b8848e1129c370d9fcc6a1cd1e3c5d7db775c1e5))
- setup vitest ([81cd426](https://github.com/Esri/arcgis-rest-js/commit/81cd426c0f72bd1575df76cf0b7c516bc51ad785))
