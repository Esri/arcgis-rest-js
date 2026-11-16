# @esri/arcgis-rest-geocoding Changelog

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

## @esri/arcgis-rest-geocoding [4.0.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-geocoding@4.0.2...@esri/arcgis-rest-geocoding@4.0.3) (2024-06-15)

### Bug Fixes

- small change to trigger a catch-up release ([#1166](https://github.com/Esri/arcgis-rest-js/issues/1166)) ([26c33b1](https://github.com/Esri/arcgis-rest-js/commit/26c33b164f7b0f1df90656dd6468ac00bdd02b1b))

## @esri/arcgis-rest-geocoding [4.0.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-geocoding@4.0.1...@esri/arcgis-rest-geocoding@4.0.2) (2022-05-11)

### Bug Fixes

- change all in-repo dep and peerDeps to use ranges ([8091910](https://github.com/Esri/arcgis-rest-js/commit/809191013b56dd71c394db13e6657301fce9f30f))

## @esri/arcgis-rest-geocoding [4.0.1](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-geocoding@4.0.0...@esri/arcgis-rest-geocoding@4.0.1) (2022-04-20)

### Bug Fixes

- update package versions post v4 launch ([2560c34](https://github.com/Esri/arcgis-rest-js/commit/2560c34b77e718ed2dd95411d1aabcf2a9d9cb57))

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.1

## @esri/arcgis-rest-geocoding [4.0.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-geocoding@3.4.3...@esri/arcgis-rest-geocoding@4.0.0) (2022-04-18)

### Bug Fixes

- add package.json files to builds for individual build types ([#955](https://github.com/Esri/arcgis-rest-js/issues/955)) ([c162125](https://github.com/Esri/arcgis-rest-js/commit/c16212594f0b914425548be5d61d7435d54a2718))

### Features

- add breaking change ([8205840](https://github.com/Esri/arcgis-rest-js/commit/8205840d81106173fdb1fe3750822e1754611c3b))
- **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))

### BREAKING CHANGES

- force 4.x release

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.0

## @esri/arcgis-rest-geocoding [4.0.0-beta.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-geocoding@4.0.0-beta.2...@esri/arcgis-rest-geocoding@4.0.0-beta.3) (2022-03-10)

### Bug Fixes

- add package.json files to builds for individual build types ([#955](https://github.com/Esri/arcgis-rest-js/issues/955)) ([c162125](https://github.com/Esri/arcgis-rest-js/commit/c16212594f0b914425548be5d61d7435d54a2718))

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.3

## @esri/arcgis-rest-geocoding [4.0.0-beta.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-geocoding@4.0.0-beta.1...@esri/arcgis-rest-geocoding@4.0.0-beta.2) (2022-03-02)

### Features

- **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.2

## @esri/arcgis-rest-geocoding 1.0.0-beta.1 (2022-02-17)

### Bug Fixes

- **bulk geocoding:** clean up code in bulk geocoding ([5e28028](https://github.com/Esri/arcgis-rest-js/commit/5e28028ff998422ce300afa4bf6fb0284b7cc5a8)), closes [#630](https://github.com/Esri/arcgis-rest-js/issues/630)
- **geocode:** ensure the magicKey property is passed through. ([#603](https://github.com/Esri/arcgis-rest-js/issues/603)) ([cc2c352](https://github.com/Esri/arcgis-rest-js/commit/cc2c352accd8b0090177f3b45fec68d95431b96e)), closes [#601](https://github.com/Esri/arcgis-rest-js/issues/601)

### Code Refactoring

- remove the word Request from custom geocoding RequestOptions interfaces ([f8c6255](https://github.com/Esri/arcgis-rest-js/commit/f8c6255ea471a1861cbbacdf03b1beb584148a8f))

### BREAKING CHANGES

- IGeocodeRequesttOptions is now IGeocodeOptions, IBulkGeocodingRequestOptions is now
  IBulkGeocodeOptions

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 1.0.0-beta.1
