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
Demo - [express](https://github.com/Esri/arcgis-rest-js/tree/master/demos/express)

## User Authentication

A [`UserSession`](/arcgis-rest-js/api/auth/UserSession/) is required in order to access private content.

```js
// hardcoded username / password
const authentication = new UserSession({
  username: "jsmith",
  password: "123456"
})

// url not accessible to anonymous users
const url = `https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World`

request(url, {
  authentication
})
  .then(response => response)
```
If you don't _know_ if a web request requires authentication, you can try it anonymously and call `ArcGISAuthError.retry()` if you encounter a `403/499`.

```js
request(url)
  .catch(err => {
    if (err.name === "ArcGISAuthError") {
      // make the same request again with a UserSession
      err.retry(appendSession)
        .then(response => console.log(response))
    }
  })

// fancy fat arrow function with an implicit 'return'
appendSession = () => Promise.resolve(authentication);
```
Demo - [batch geocoding](https://github.com/Esri/arcgis-rest-js/tree/master/demos/batch-geocoder-node)



