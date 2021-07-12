---
title: Using ArcGIS REST JS in Node.js
navTitle: Node.js
description: Learn how to integrate the ArcGIS REST JS library into a Node.js app.
order: 50
group: 1-get-started
---

# Get Started with Node.js

Make sure you have polyfills for [`fetch`](https://github.com/lquixada/cross-fetch) and [`FormData`](https://github.com/form-data/isomorphic-form-data) installed before using any ArcGIS REST JS library. You can find `npm install` commands for all packages in the [API reference](/arcgis-rest-js/api).

```bash
npm install @esri/arcgis-rest-request @esri/arcgis-rest-auth cross-fetch isomorphic-form-data
```

Require `cross-fetch` and `isomorphic-form-data` before using any of the ArcGIS REST JS methods.
```js
// ensures fetch is available as a global
require("cross-fetch/polyfill");
require("isomorphic-form-data");

const { request } = require("@esri/arcgis-rest-request");

request("https://www.arcgis.com/sharing/rest/info")
  .then(response);
```

Or, if using Node.js [ES Modules](https://nodejs.org/docs/latest-v12.x/api/packages.html#packages_determining_module_system) import syntax:


```js
import fetch from "node-fetch";
import FormData from "isomorphic-form-data";
import arcgisRestRequest from "@esri/arcgis-rest-request";
arcgisRestRequest.setDefaultRequestOptions({ fetch, FormData });

arcgisRestRequest.request("https://www.arcgis.com/sharing/rest/info")
  .then(response);
```

You can also pass through your own named `fetch` implementation.

```js
const fetch = require("node-fetch")
const {
  request,
  setDefaultRequestOptions
} = require("@esri/arcgis-rest-request");

// one by one
request("https://www.arcgis.com/sharing/rest/info", { fetch })

// or in *every* request
setDefaultRequestOptions({ fetch })
```

## Demo - [Express](https://github.com/Esri/arcgis-rest-js/tree/master/demos/express)

### Authentication

To access premium content and services without asking for user credentials, using an [API key](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/api-keys/) or [application credentials](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/application-credentials/) is typically the best approach.

#### API Key

```js
// no auth required
request(`https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?token={API_KEY}`)
```

#### Application credentials

```js
const { ApplicationSession } = require("@esri/arcgis-rest-auth");

const authentication = new ApplicationSession({
  clientId: "public",
  clientSecret: "secret"
})

// url not accessible to anonymous users
const url = `https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World`

// token will be appended by rest-js
request(url, {
  authentication
})
```

## Demo - [batch geocoding](https://github.com/Esri/arcgis-rest-js/tree/master/demos/batch-geocoder-node)

Applications cannot [create, share, access or modify items](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/limitations-of-application-authentication/) in ArcGIS Online or ArcGIS Enterprise. For this, a [`UserSession`](/arcgis-rest-js/api/auth/UserSession/) is more appropriate.

```js
const { UserSession } = require("@esri/arcgis-rest-auth");

// hardcoded username / password
const authentication = new UserSession({
  username: "jsmith",
  password: "123456"
})
```
See the [Browser Authentication](../browser-authentication/) for more information about implementing OAuth 2.0.
