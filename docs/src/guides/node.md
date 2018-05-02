---
title: Using ArcGIS REST JS in Node.js
navTitle: Node.js
description: Learn how to integrate the ArcGIS REST JS library into a Node.js app.
order: 60
group: 1-get-started
---

# Get Started with Node.js

Make sure you have polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`FormData`](https://github.com/form-data/isomorphic-form-data) installed before using any ArcGIS REST JS library. You can find `npm install` commands for all packages in the [API reference](../../api).

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
