---
title: Using ArcGIS REST JS with Bundlers
navTitle: Bundlers
description: Learn how to integrate the ArcGIS REST JS library with Babel and modern bundlers like webpack, Rollup and Parcel.
order: 30
group: 1-get-started
---

# Get Started with webpack, Rollup or Parcel

ArcGIS REST JS works well with popular module bundlers like [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) and [Parcel](https://parceljs.org/).

If you need to support environments where [`fetch`](https://github.com/lquixada/cross-fetch) and [`Promise`](https://github.com/stefanpenner/es6-promise) aren't already present, you can install polyfills for them.

```bash
npm install @esri/arcgis-rest-request
```
You can find `npm install` commands for all packages in the [API reference](../../api).
```js
import 'cross-fetch/polyfill';
import { request } from "@esri/arcgis-rest-request";

request("https://www.arcgis.com/sharing/rest/info")
  .then(response => {
    console.log(response);
  });
```

# Tree Shaking

Bundlers like webpack and Rollup can statically analyze the code inside ArcGIS REST JS and exclude anything that isn't used. This is called [dead-code elimination](https://rollupjs.org/guide/en#tree-shaking) and it means `rest-js` won't bloat your bundle.

Its worth noting, to activate tree-shaking in webpack, [production](https://webpack.js.org/configuration/mode/#mode-production) mode and [usedExports](https://webpack.js.org/configuration/optimization/#optimizationusedexports) optimization need to be enabled.

```js
// webpack.config.js
module.exports = {
  // ...
  mode: 'production',
  optimization: {
    usedExports: true
  },
  // ...
}
```

### Tree Shaking Demos

* [webpack](https://github.com/Esri/arcgis-rest-js/tree/master/demos/tree-shaking-webpack)
* [Rollup](https://github.com/Esri/arcgis-rest-js/tree/master/demos/tree-shaking-rollup)

**Note**: many libraries and tools (such as [Babel](https://babeljs.io/docs/usage/polyfill/)) require an ES6 `Promise` polyfill. Any `Promise` polyfill will work with ArcGIS REST JS, `es6-promise` is simply a lightweight standalone version.
