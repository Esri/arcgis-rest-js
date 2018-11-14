---
title: Using ArcGIS REST JS with Babel and Webpack
navTitle: Babel + WebPack
description: Learn how to integrate the ArcGIS REST JS library into a Babel and Webpack based workflow.
order: 30
group: 1-get-started
---

# Get Started with Babel and Webpack

ArcGIS REST JS is ready-to-use with popular module bundlers like [webpack](https://webpack.js.org/) and [rollup](https://rollupjs.org/). Make sure you also install the polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`Promise`](https://github.com/stefanpenner/es6-promise). You can find `npm install` commands for all packages in the [API reference](../../api).

```bash
npm install @esri/arcgis-rest-request isomorphic-fetch es6-promise
```

Import the `isomorphic-fetch` and `es6-promise` polyfills before using ArcGIS REST JS.

```js
import "isomorphic-fetch";
import "es6-promise";

import { request } from "@esri/arcgis-rest-request";

request("https://www.arcgis.com/sharing/rest/info").then(response => {
  console.log(response);
});
```

**Note**: many other libraries or tools (such as [Babel](https://babeljs.io/docs/usage/polyfill/)) require an ES6 `Promise` polyfill. Any `Promise` polyfill will work with ArcGIS REST JS, `es6-promise` is simply a lightweight standalone version.
