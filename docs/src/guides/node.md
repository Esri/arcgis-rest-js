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

request("https://www.arcgis.com/sharing/rest/info")
  .then(response);
```
Demo - [Express Application](https://github.com/Esri/arcgis-rest-js/tree/master/demos/express)

## Authentication

To access premium content and services without asking for user credentials, using a [Proxy Service](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/working-with-proxies/) or [App Login](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/accessing-arcgis-online-services/) is typically the best approach.

Proxy Service
```js
// no auth required
request(`https://utility.arcgis.com/usrsvcs/appservices/{unique}/rest/services/World/Route/NAServer/Route_World/solve`)
```
App Login
```js
const authentication = new ApplicationSession({
  clientId: "public",
  clientSecret: "secret"
})

// url not accessible to anonymous users
const url = `https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World`

// token will be appended by rest-js
request(url, {
  authentication
})
```

Demo - [batch geocoding](https://github.com/Esri/arcgis-rest-js/tree/master/demos/batch-geocoder-node)

Applications cannot [create, update, share, modify of delete items](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/limitations-of-application-authentication/) in ArcGIS Online or ArcGIS Enterprise. For this, a [`UserSession`](/arcgis-rest-js/api/auth/UserSession/) is more appropriate.

```js
// hardcoded username / password
const authentication = new UserSession({
  username: "jsmith",
  password: "123456"
})
```
See the [Browser Authenication](../browser-authentication/) for more information about implementing OAuth 2.0.




