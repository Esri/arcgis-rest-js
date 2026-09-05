---
"@esri/arcgis-rest-developer-credentials": minor
"@esri/arcgis-rest-basemap-sessions": minor
"@esri/arcgis-rest-feature-service": minor
"@esri/arcgis-rest-demographics": minor
"@esri/arcgis-rest-elevation": minor
"@esri/arcgis-rest-geocoding": minor
"@esri/arcgis-rest-request": minor
"@esri/arcgis-rest-routing": minor
"@esri/arcgis-rest-places": minor
"@esri/arcgis-rest-portal": minor
"@esri/arcgis-rest-auth": minor
---

## Summary

This is a minor change that groups `IRequestOptions` properties and improves fetch options management. This simplification allows for better handling of options between internal methods.
Users are recommended to update their request options properties, although `request()` will conform legacy-shaped options to the updated `IRequestOptions` shape for backwards-compatibility.

## Changes

Added `IRequestFlags` interface.

`request()` control options are moved under `requestFlags`:

- `hideToken` is deprecated and is being moved to `requestFlags.hideToken`.
- `suppressWarnings` is deprecated and is being moved to `requestFlags.suppressWarnings`.
- `maxUrlLength` is deprecated and is being moved to a boolean flag under `requestFlags.ignoreMaxUrlLength` which will allow user to enforce custom limits within fetch.

Web API Fetch options are moved under `fetchOptions`:

- `httpMethod` is deprecated and is being moved to `fetchOptions.method`.
- `credentials` is deprecated and is being moved to `fetchOptions.credentials`.
- `headers` is deprecated and is being moved to `fetchOptions.headers`.
- `signal` is deprecated and is being moved to `fetchOptions.signal`.
- standalone deprecated options:
- `rawResponse` is deprecated and will be removed in a future release.

## Migration Guide

Update all `IRequestOptions` objects to the new nested shape:

1. Remove `rawResponse`.
2. Remove `request`.

3. Request Flags:

```ts
// Before
const options: IRequestOptions = {
  hideToken: true,
  suppressWarnings: true,
  maxUrlLength: 5000 // some number
}

// After
const requestFlags: IRequestFlags = {
  hideToken: true,
  suppressWarnings: true,
  ignoreMaxUrlLength: true
}
const options: IRequestOptions {
  requestFlags
}
```

4. Fetch Options:

- Move `credentials`, `headers`, and `signal` under `fetchOptions`.
- Rename `httpMethod` to `method` and move under `fetchOptions`.

```ts
// Before
const options: IRequestOptions = {
  credentials: 'omit'
  headers: Headers
  signal: AbortController.signal
  httpMethod: 'POST'
}

// After
const fetchOptions: RequestInit = {
  credentials: 'omit'
  headers: Headers
  signal: AbortController.signal
  method: 'POST'
}
const options: IRequestOptions {
  fetchOptions
}
```
