---
"@esri/arcgis-rest-request": major
---

## Summary

This change removes `withOptions()` from REST JS.

## Breaking Changes

- `withOptions()` removed from `@esri/arcgis-rest-request`.

## Migration Guide

Replace `withOptions()` by constructing an `IRequestOptions` object and invoking `request(url, options)` with the options object.
