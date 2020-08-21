---
title: Get Started
description: Get started with ArcGIS REST JS.
---

# Get Started

ArcGIS REST JS can be deployed with a variety of build tools, including:

* [From a CDN](./from-a-cdn/)
* [webpack, Rollup and Parcel](./bundlers/)
* [AMD (Require.js or Dojo)](./amd-requirejs-dojo/)
* [Node.js](./node/)
* [What's New in `v2.0.0`?](./whats-new-v2-0/)
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
* [`Fetch` polyfill](https://github.com/bitinn/node-fetch)

## Node.js Support

ArcGIS REST JS is supported in Node.js 8.x and above. It requires additional packages to polyfill `Fetch` and `FormData`.

We recommend the ones below:

* [`node-fetch`](https://github.com/bitinn/node-fetch) - to polyfill `Fetch`
* [`isomorphic-form-data`](https://github.com/form-data/isomorphic-form-data) - to polyfill `FormData`

```js
const fetch = require('node-fetch');
const { setDefaultRequestOptions, request } = require('@esri/arcgis-rest-request');

// use node-fetch for each request instead of relying on a global
setDefaultRequestOptions({ fetch })

request(url)
  .then(response)
```
Other versions of Node.js may also work with appropriate polyfills but we cannot guarantee support.
