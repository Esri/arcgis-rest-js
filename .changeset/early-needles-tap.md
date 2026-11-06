---
"@esri/arcgis-rest-request": major
---

Remove `hideToken` request option support and rely on explicit request flags for `token` placement.

## What changed

- Deprecated `hideToken` from request options.
- Moved `hideToken` to legacy request options.
- Removed `hideToken` behavior.
- Removed legacy top-level `hideToken` from request option handling.
- Removed `requestFlags.hideToken` from request option handling.
- GET token behavior now solely relies on explicit header request flags:
  - `requestFlags.useAuthorizationHeader`
  - `requestFlags.useXEsriAuthorizationHeader`
- GET to POST fallback now occurs only for URL length checks (`ignoreMaxUrlLength` behavior unchanged).
- GET now token stays in url string by default unless request flags are used.

## Migration

If you previously used `hideToken` to avoid query-param tokens on GET requests, switch to explicit header flags in Node.js.

```ts
// Before
await request(url, {
  fetchOptions: { method: "GET" },
  requestFlags: {
    hideToken: true
  },
  authentication
});

// After
await request(url, {
  fetchOptions: { method: "GET" },
  requestFlags: {
    useAuthorizationHeader: true
    // or useXEsriAuthorizationHeader: true
  },
  authentication
});
```

Behavior notes:

- GET + no header flags: token remains in URL query params.
- GET + header flag(s): token is sent via header(s), not URL params.
- POST requests continue to send token in body by default.
- Assigning header flags always moves token to authorization headers for both GET and POST request methods.
