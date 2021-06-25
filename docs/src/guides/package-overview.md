---
title: Package Overview
description: Overview of packages provided by ArcGIS REST JS.
order: 10
group: 0-introduction
---

# Why `@esri/arcgis-rest-js`?

`@esri/arcgis-rest-js` simplifies making requests to ArcGIS Online and Enterprise in both browsers and Node.js.

There's no better way to explain what that means than comparing an `@esri/arcgis-rest-js` call to the same web request made using plain old JavaScript.

### @esri/arcgis-rest

```js
import { getUser } from "@esri/arcgis-rest-portal";

// pass in a username and get back information about the user
getUser(`jgravois`)
  .then(response) // { firstName: "john", description: "open source geodev" ... }
```

### vs. Vanilla JavaScript

```js
// construct the url yourself and don't forget to tack on f=json
const url = "https://www.arcgis.com/sharing/rest/community/users/jgravois?f=json";

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState == XMLHttpRequest.DONE) {
    xhr.responseText; // { firstName: "john", description: "open source geodev" ... }
  }
}
xhr.open('GET', url, true);
xhr.send(null);
```

wow, thats a lot easier! `@esri/arcgis-rest-js` is able to intuit the actual url (by default it assumes you're interacting with ArcGIS Online) prior to making the request and internalizes a lot of tedious logic for handling the response.

Our packages tap into a new JavaScript spec called [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) under the hood though, so lets compare 🍎s to 🍎s.

```js
import { deleteFeatures } from "@esri/arcgis-rest-feature-layer";

const url = `http://sampleserver6.arcgisonline.com/arcgis/rest/services/SF311/FeatureServer/1/`

// https://esri.github.io/arcgis-rest-js/api/feature-service/deleteFeatures/
deleteFeatures({
  url,
  objectIds: [ 2360245 ]
})
  .then(response)
```

```js
// append operation name to url
url += `deleteFeatures`;

fetch(url, {
  // set the request type
  method: "POST",
  // append appropriate headers
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  // concatenate and encode each parameter manually
  // and remember to append f=json
  body: `objectIds=${encodeURIComponent(2360245)}&f=json`
})
  .then(response => {
    // cast the response as JSON
    if (response.ok) {
      return response.json()
    }
  })
  .then(response => {
    // trap for ArcGIS error objects in 200 responses
    if (!response.error) {
      console.log(response);
    }
  })
```

As you can see, `@esri/arcgis-rest-js` is still handling a _lot_ of the details internally.

* the operation name is appended to urls
* a `"POST"` is made automatically (when appropriate)
* query string parameters are encoded
* appropriate `headers` are appended
* `FormData` is created internally (when necessary)
* `200` responses that contain an error are trapped for
* the generic `f=json` parameter is appended

And we haven't even begun to discuss [authentication](../browser-authentication/).

Whether you're trying to automate interacting with premium services in Node.js or creating a website that will allow users to sign into [ArcGIS Online](https://www.arcgis.com) safely and manage their own content, `@esri/arcgis-rest-js` has you covered.

# Package Overview

The library is a collection of _very_ small mix and match packages that are framework agnostic and make a variety of ArcGIS tasks more convenient.

* [`@esri/arcgis-rest-request`](../../api/request/) - Underpins other packages and supports making low-level requests.
* [`@esri/arcgis-rest-auth`](../../api/auth/) - Provides methods for authenticating named users and applications.
* [`@esri/arcgis-rest-portal`](../../api/portal/) - Methods for working with ArcGIS Online/Enterprise content and users.
* [`@esri/arcgis-rest-feature-layer`](../../api/feature-layer/) - Functions for querying and editing features inside of hosted feature layers.
* [`@esri/arcgis-rest-service-admin`](../../api/service-admin/) - Functions for administering hosted services.
* [`@esri/arcgis-rest-geocoding`](../../api/geocoding/) - Geocoding wrapper for `@esri/arcgis-rest-js`
* [`@esri/arcgis-rest-routing`](../../api/routing/) - Routing and directions wrapper for `@esri/arcgis-rest-js`.
* [`@esri/arcgis-rest-types`](../../api/types/) - Common Typings for TypeScript developers.