---
title: Using ArcGIS REST JS with Bundlers
navTitle: Bundlers
description: Learn how to integrate the ArcGIS REST JS library with Babel and modern bundlers like webpack, Rollup and Parcel.
order: 30
group: 1-get-started
---

# Get Started with Bundlers and Babel

ArcGIS REST JS works well with popular module bundlers like [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) and [Parcel](https://parceljs.org/). Make sure you also install the polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`Promise`](https://github.com/stefanpenner/es6-promise). You can find `npm install` commands for all packages in the [API reference](../../api).

```bash
npm install @esri/arcgis-rest-request isomorphic-fetch es6-promise
```

Import the `isomorphic-fetch` and `es6-promise` polyfills before using ArcGIS REST JS.

```js
import "isomorphic-fetch";
import "es6-promise";

import { request } from "@esri/arcgis-rest-request";

request("https://www.arcgis.com/sharing/rest/info")
  .then(response => {
    console.log(response);
  });
```

# Tree Shaking

Because `rest-js` doesn't induce side effects, bundlers like webpack and Rollup can statically analyze the code and exclude anything that isn't used. This is called dead-code elimination](https://rollupjs.org/guide/en#tree-shaking)and it means `rest-js` won't bloat production bundles.

### Demos

* [webpack](https://github.com/Esri/arcgis-rest-js/tree/master/demos/tree-shaking-webpack)
* [Rollup](https://github.com/Esri/arcgis-rest-js/tree/master/demos/tree-shaking-rollup)

**Note**: many libraries and tools (such as [Babel](https://babeljs.io/docs/usage/polyfill/)) require an ES6 `Promise` polyfill. Any `Promise` polyfill will work with ArcGIS REST JS, `es6-promise` is simply a lightweight standalone version.