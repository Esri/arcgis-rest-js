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

This change removes `rawResponse` and `maxUrlLength` from top-level `IRequestOptions`, and moves native Response fetch behavior to `rawRequest`. Improve options handling and remove legacy properties.

- Removed deprecated `rawResponse` property from `IRequestOptions`.
- Removed deprecated `maxUrlLength` property from `IRequestOptions`.
- Removed deprecated `request` property from `IRequestOptions`.
- Changed `request()` to return JSON only. Non-JSON `f` url query format params are coerced to `json` with a warning.
- Added `rawRequest()` to fetch the native response object that users can process for custom behavior.

## Breaking Changes

- `request()` now only supports JSON payload handling by coercing `f` values to `f=json`.

  - When you set `f` values to non-JSON values such as `text` or `html` and pass it via `IRequestOptions.params` to `request()`, the `f` value will be coerced to `json` and a warning emitted.
  - Use `rawRequest()` when you need to fetch an HTTP response object, query non-JSON `f` values, and when you need to process a native HTTP Response object.

- `rawResponse` is no longer supported as an `IRequestOptions` property in `request(url, options)`.
- `maxUrlLength` is no longer supported as an `IRequestOptions` property in `request(url, options)`.
- `request` is no longer supported as an `IRequestOptions` property in `request(url, options)`.

## Migration Guide

1. Replace `request(..., { rawResponse: true, ...options })` with `rawRequest(..., options)`.

```ts
// Before
const response = await request(url, {
  rawResponse: true,
  params: { f: "pbf" }
});
const bytes = await response.arrayBuffer();

// After
const response = await rawRequest(url, { params: { f: "pbf" } });
const bytes = await response.arrayBuffer();
```

2. If you need text/html/blob/pbf from an endpoint, replace `request()` with `rawRequest()`.

```ts
// Before
const text = await request(url, { params: { f: "html" } });

// After
const response = await rawRequest(url, { params: { f: "html" } });
const text = await response.text();
```

3. Move `maxUrlLength` usage to `requestFlags.ignoreMaxUrlLength`.

Before, you could specify a GET request, and it would return so long as the max URL length was < 2000 or < the user-specified `maxUrlLength`.
Now, if the max URL length surpasses 2000, `request()` will change request method from GET to POST unless the user specifies `ignoreMaxUrlLength` true in `requestFlags.ignoreMaxUrlLength`.
For large URL's, use `requestFlags.ignoreMaxUrlLength` with GET requests to avoid REST JS coercing the request to POST.

```ts
// Before
await request(url, { httpMethod: "GET", maxUrlLength: 5000 });

// After
await request(url, {
  fetchOptions: { method: "GET" },
  requestFlags: { ignoreMaxUrlLength: true }
});
```

4. Remove `request` property from any options objects.
