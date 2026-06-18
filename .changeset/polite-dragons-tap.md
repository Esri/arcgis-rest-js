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

This release changes how HTTP responses are accessed and redefines top-level request options.

## Summary

This release introduces rawRequest() for direct HTTP response access and removes legacy request option patterns.

- `request()` returns JSON only. Non-JSON `f` values are coerced to `json` with a warning.
- `rawResponse` is no longer supported. Use `rawRequest()` instead.
- `maxUrlLength` is no longer supported. Use requestFlags.ignoreMaxUrlLength with GET requests to avoid REST JS coercing the request to POST for large URLs.

## Breaking changes

- `request()` now only supports JSON payload handling by coercing `f=json`.

  - If you pass `params.f` values like `text` or `html` to `request()`, the value is coerced to `json` and a warning is emitted.
  - Use `rawRequest()` when you need custom response formats or direct access to the native Response.

- `rawResponse` as an `IRequestOptions` property is no longer supported for `request()`.

  - Previous pattern: `request(url, { rawResponse: true, ... })`
  - New pattern: `rawRequest(url, options)`

- `maxUrlLength` as an `IRequestOptions` property is no longer supported.
  - Previous pattern: { maxUrlLength: 3000 }
  - New pattern: { requestFlags: { ignoreMaxUrlLength: true } }

## Why these changes were made

- Improve options handling and remove legacy properties.
- Make generic return types feasible.
- Contain HTTP-related fetch options and ArcGIS request flags within their own respective objects for a clearer API surface.

## Migration guide

1. Replace request(..., { rawResponse: true, ...options }) with rawRequest(..., options).

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

2. If you need text/html/blob/pbf from an endpoint, switch from request() to rawRequest().

```ts
// Before
const text = await request(url, { params: { f: "html" } });

// After
const response = await rawRequest(url, { params: { f: "html" } });
const text = await response.text();
```

3. Move top-level maxUrlLength usage to requestFlags.ignoreMaxUrlLength.

Before, you could specify a GET request, and it would return so long as the max URL length was < 2000 or < the user-specified `maxUrlLength`.
Now, if the max URL length surpasses 2000, `request()` will change request method from GET to POST unless the user specifies `ignoreMaxUrlLength` true in `requestFlags.ignoreMaxUrlLength`.

```ts
// Before
await request(url, { httpMethod: "GET", maxUrlLength: 5000 });

// After
await request(url, {
  fetchOptions: { method: "GET" },
  requestFlags: { ignoreMaxUrlLength: true }
});
```
