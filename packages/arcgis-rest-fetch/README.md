# `@esri/arcgis-rest-request`

This package exists to expose the `node-fetch` package in a consistent way for both Node JS 12.16+ and various bundlers with consistent TypeScript types based on the browser types.

This exposes a `getFetch()` method that returns a Promise that resolves with `fetch`, `Headers`, `Request` and `Response`. This is async because it uses `import("node-fetch")` under to hood to load `node-fetch@3.0.0` which is ESM only. The only way to load an ESM module in CommonJS in Node is to use the async `import()`.

The `package.json` contains fields for the following:

- `main` - `undefined`, Node JS should use the `exports` field and [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports).
- `module` - Exposes a ESM module. Used by Rollup and Parcel v2.
- `browser` - Exposes a CJS module. Used by Parcel v1 and Browserify.
- `exports` - exposes [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports) config with the following conditions. Used by Webpack and [soon to be others](https://github.com/parcel-bundler/parcel/issues/4155#issuecomment-756457121):
  - `module` - ESM module exposing browser globals.
  - `browser` - CJS module exposing browser globals.
  - `import` - ESM module exposing `node-fetch`.
  - `require` - CJS module exposing `node-fetch`.
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
