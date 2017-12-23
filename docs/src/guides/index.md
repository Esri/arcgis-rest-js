---
title: Get Started
description: Get started with ArcGIS REST JS.
---

# Get Started

ArcGIS REST JS is capable of being deployed with variety of JavaScript projects and build tools, including:

* [From a CDN](./from-a-cdn/) (Coming soon)
* [Babel + WebPack](./babel-and-webpack/) (Coming soon)
* [TypeScript + WebPack](./typescript-and-webpack/) (Coming soon)
* [AMD (Require.js or Dojo)](amd-requirejs-dojo/) (Coming soon)
* [Node.js](./node/) (Coming soon)
* [Babel + Rollup](./babel-and-rollup/) (Coming soon)
* [Browserify](./browserify/) (Coming soon)

## Requirements

ArcGIS REST JS takes advantage of web standards that are supported in all modern desktop browsers and most mobile browsers.

* [`Fetch` Support](https://caniuse.com/#feat=fetch)
* [`Promises` Support](https://caniuse.com/#feat=promises)
* [`FormData` Support](https://caniuse.com/#feat=xhr2)
* [`ECMAScript 5` Support](https://caniuse.com/#feat=es5)

## Browser Support

ArcGIS REST JS is supported in the same browsers as the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/guide/system-requirements/index.html#supported-browsers).

* Chrome
* Edge
* Firefox
* Safari 9 and later
* iOS Safari
* IE11

IE11 and older mobile browsers require polyfills.

* [`Promise` polyfill](https://github.com/stefanpenner/es6-promise)
* [`Fetch` polyfill](https://github.com/matthew-andrews/isomorphic-fetch)

## Node.js Support

ArcGIS REST JS is supported in Node.js 6.x and 8.x. It requires additional packages to polyfill `Fetch` and `FormData`.

We recommend the ones below:

* [`isomorphic-fetch`](https://www.npmjs.com/package/isomorphic-fetch) - to polyfill `Fetch`
* [`isomorphic-form-data`](https://github.com/form-data/isomorphic-form-data) - to polyfill `FormData`

Other versions of Node.js may also work with appropriate polyfills but we cannot guarantee support.

## Get started from CDN

ArcGIS REST JS is hosted on [unpkg](https://unpkg.com/). You can find URLs for individual packages in the [API reference](../api).

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>ArcGIS REST JS</title>
</head>
<body>
  Open your console to see the demo.
</body>
  <!-- require polyfills for fetch and Promise from https://polyfill.io -->
  <script src="https://cdn.polyfill.io/v2/polyfill.js?features=es5,Promise,fetch"></script>

  <!-- require ArcGIS REST JS libraries from https://unpkg.com -->
  <script src="{% cdnUrl data.typedoc | findPackage('@esri/arcgis-rest-request') %}"></script>

  <script>
    // when including ARcGIS REST JS all exports are available from a arcgisRest global
    arcgisRest.request("https://www.arcgis.com/sharing/rest/info").then(response => {
      console.log(response);
    });
  </script>
</html>
```

## Get started with a bundler (webpack, rollup, ect&hellip;)

ArcGIS REST JS is ready-to-use with popular module bundlers such as [webpack](https://webpack.js.org/) and [rollup](https://rollupjs.org/). Make sure you also install the polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`Promise`](https://github.com/stefanpenner/es6-promise). You can find `npm install` commands for all packages in the [API reference](../api).

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

**Note**: many other libraries or tools (such as [Babel](https://babeljs.io/docs/usage/polyfill/)) require an ES 6 `Promise` polyfill. Any `Promise` polyfill will work with ArcGIS REST JS, `es6-promise` is simply a lightweight standalone version.

## Get started with Node.js

Make sure you have polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`FormData`](https://github.com/form-data/isomorphic-form-data) installed before using any ArcGIS REST JS library. You can find `npm install` commands for all packages in the [API reference](../api).

```bash
npm install @esri/arcgis-rest-request isomorphic-fetch isomorphic-form-data
```

Require the `isomorphic-fetch` and `isomorphic-form-data` modules before using any of the ArcGIS REST JS methods.

```js
require("isomorphic-fetch");
require("isomorphic-form-data");

const { request } = require("@esri/arcgis-rest-request");

request("https://www.arcgis.com/sharing/rest/info").then(response => {
  console.log(response);
});
```

[Demo express application](https://github.com/Esri/arcgis-rest-js/tree/master/demos/express)
