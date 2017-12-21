---
title: Get Started
description: Get started with the ArcGIS REST JS library.
---

# Get Started

To get started with the ArcGIS REST JS libraries your will need to support the [`Promise`](), [`fetch`]() and [`FormData`]() web standards as well a full ECMAScript 5 environment. **All modern browsers including Chrome, Safari, Firefox and Edge as well as most mobile browsers support all of these features.**

* [`fetch` Support](https://caniuse.com/#feat=fetch)
* [`Promise` Support](https://caniuse.com/#feat=promises)
* [`FormData` Support](https://caniuse.com/#feat=xhr2)
* [`ECMAScript 5` Support](https://caniuse.com/#feat=es5)


## Browser Support

The ArcGIS REST JS libraries support the same browsers as the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/guide/system-requirements/index.html#supported-browsers) This includes:

* Chrome
* Edge
* Firefox
* Safari 9 and later
* iOS Safari
* IE11

However to support older browsers such as older mobile browsers or IE 11 you will need additional polyfills:

* [`Promise` polyfill](https://github.com/stefanpenner/es6-promise)
* [`fetch` polyfill](https://github.com/matthew-andrews/isomorphic-fetch)

## Node JS Support

ArcGIS REST JS libraries support Node JS 6.x.x and 8.x.x You will need polyfills for `fetch` and `FormData`. Other versions of Node JS may work with appropriate polyfills but we cannot guarantee support. We recommend the following polyfills for `fetch` and `FormData` at the root of your application.

* [`fetch` polyfill](https://github.com/matthew-andrews/isomorphic-fetch)
* [`FormData` polyfill](https://github.com/form-data/isomorphic-form-data)

## Get started from CDN

Coming soon&hellip;

## Get started with a bundler (webpack, rollup, ect&hellip;)

Coming soon&hellip;

## Get started with Node JS

Make sure you have polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`FormData`](https://github.com/form-data/isomorphic-form-data) installed before using any ArcGIS REST JS library,

```bash
npm install isomorphic-fetch isomorphic-form-data @esri/arcgis-rest-request
```

```js
require("isomorphic-fetch");
require("isomorphic-form-data");

const { request } = require("@esri/arcgis-rest-request");

request("https://www.arcgis.com/sharing/rest/info").then(response => {
  console.log(response);
});
```
