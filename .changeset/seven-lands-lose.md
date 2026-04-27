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

### What

This is a breaking change to `IRequestOptions`.

- `IRequestOptions` top-level properties were reorganized:
  - request control flags were moved under `requestFlags` as follows:
  - `hideToken` is deprecated and is being moved to `requestFlags.hideToken`.
  - `suppressWarnings` is deprecated and is being moved to `requestFlags.suppressWarnings`.
  - `maxUrlLength` is deprecated and is being moved to a boolean flag under `requestFlags.ignoreMaxUrlLength` which will allow user to enforce custom limits within fetch.
  - `fetch`-related options were moved under `fetchOptions` as follows:
  - `httpMethod` is deprecated and is being moved to `fetchOptions.method`.
  - `credentials` is deprecated and is being moved to `fetchOptions.credentials`.
  - `headers` is deprecated and is being moved to `fetchOptions.headers`.
  - `signal` is deprecated and is being moved to `fetchOptions.signal`.
  - standalone deprecated options:
  - `rawResponse` is deprecated and will be removed in a future version.
  - `request` is deprecated and will be removed in a future version.

### Why

Simplifying request options by grouping fetch options together allows better handling of options between internal methods.

### How to migrate

Update all `IRequestOptions` call sites to use the new nested properties:

- Move `credentials`, `headers`, and `signal` under `fetchOptions`.
- Rename `httpMethod` to `method` and move under `fetchOptions`.
- Move `hideToken` and `suppressWarnings` under `requestFlags`.
- Remove `maxUrlLength` in favor of `requestFlags.ignoreMaxUrlLength`.
- Property `rawResponse` is being removed in favor of a publicly exported`rawRequest()` method.
- Remove `request`.
