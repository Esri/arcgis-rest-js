# `@esri/arcgis-rest-form-data`

This package exists to expose the `formdata-node` package in a consistent way for both Node JS 12.16+ and bundlers with consistent TypeScript types based on the browser.

## `package.json` fields

- `main` - `undefined`, Node JS should use the `exports` field and [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports).
- `module` - Exposes a ESM module that exposes `FormData`, `File` and `Blob` from the global object. Used by Rollup and Parcel v2.
- `browser` - Exposes a CJS module that exposes `FormData`, `File` and `Blob` from the global object. Used by Parcel v1 and Browserify.
- `exports` - exposes [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports) config with the following conditions:
  - `module` - ESM module exposing browser globals.
  - `browser` - CJS module exposing browser globals.
  - `import` - ESM module exposing `formdata-node`.
  - `require` - CJS module exposing `formdata-node`.
  - `default` - ESM module exposing `formdata-node`.
