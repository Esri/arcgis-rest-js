# `@esri/arcgis-rest-form-data`

This package exists to expose the `formdata-node` package in a consistent way for both Node JS 12.16+ and various bundlers with consistent TypeScript types based on the browser types.

The `package.json` contains fields for the following:

- `main` - `undefined`, Node JS should use the `exports` field and [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports).
- `module` - Exposes a ESM module that exposes `FormData`, `File` and `Blob` from the global object. Used by Rollup and Parcel v2.
- `browser` - Exposes a CJS module that exposes `FormData`, `File` and `Blob` from the global object. Used by Parcel v1 and Browserify.
- `exports` - exposes [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports) config with the following conditions. Used by Webpack and [soon to be others](https://github.com/parcel-bundler/parcel/issues/4155#issuecomment-756457121):
  - `module` - ESM module exposing browser globals.
  - `browser` - CJS module exposing browser globals.
  - `import` - ESM module exposing `formdata-node`.
  - `require` - CJS module exposing `formdata-node`.
  - `default` - ESM module exposing browser globals.

Copyright &copy; 2017-2022 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](../../LICENSE) file.
