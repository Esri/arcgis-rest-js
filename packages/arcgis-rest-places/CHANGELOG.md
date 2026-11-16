# @esri/arcgis-rest-places Changelog

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

## @esri/arcgis-rest-places [1.2.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-places@1.1.0...@esri/arcgis-rest-places@1.2.0) (2025-02-10)

### Features

- **arcgis-rest-places:** places api - add icon param ([203821d](https://github.com/Esri/arcgis-rest-js/commit/203821dad9ded6fff3b28b11fc352dba3c900e0c)), closes [#1175](https://github.com/Esri/arcgis-rest-js/issues/1175) [#1175](https://github.com/Esri/arcgis-rest-js/issues/1175) [#1183](https://github.com/Esri/arcgis-rest-js/issues/1183)

## @esri/arcgis-rest-places [1.1.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-places@1.0.2...@esri/arcgis-rest-places@1.1.0) (2024-06-18)

### Features

- Allow arcgis rest places package to use dev endpoints ([#1170](https://github.com/Esri/arcgis-rest-js/issues/1170)) ([d0ca26d](https://github.com/Esri/arcgis-rest-js/commit/d0ca26d3d0cbcb18de2475974ce5b5c4261eef69))

## @esri/arcgis-rest-places [1.0.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-places@1.0.1...@esri/arcgis-rest-places@1.0.2) (2024-06-15)

### Bug Fixes

- small change to trigger a catch-up release ([#1167](https://github.com/Esri/arcgis-rest-js/issues/1167)) ([42fb211](https://github.com/Esri/arcgis-rest-js/commit/42fb21132211e7a3ab0e615bf3cb640b147fbe20))

## @esri/arcgis-rest-places [1.0.1](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-places@1.0.0...@esri/arcgis-rest-places@1.0.1) (2023-06-27)

### Bug Fixes

- **arcgis-rest-places:** update pagination values for latest API ([#1109](https://github.com/Esri/arcgis-rest-js/issues/1109)) ([ea5370c](https://github.com/Esri/arcgis-rest-js/commit/ea5370c7b847ab6ef9314f7b54d04a278f124e62))

## @esri/arcgis-rest-places 1.0.0 (2023-05-04)

### Features

- **arcgis-rest-places:** Add support for the new Places service via a new arcgis-rest-places package ([6ee5a54](https://github.com/Esri/arcgis-rest-js/commit/6ee5a54f7f71b0590e4b905fa6de97a22f337bd9))
