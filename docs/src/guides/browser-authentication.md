---
title: Browser-based authentication with ArcGIS REST JS
navTitle: Browser-based OAuth 2.0
description: Learn how to authenticate users with ArcGIS REST JS and OAuth 2.0 in a browser.
order: 1
group: 2-authentication
---

# Authentication in Browser-based Apps

In the [Node.js](/arcgis-rest-js/node/) guide we explained how to instantiate an [`ApplicationSession`](/arcgis-rest-js/api/auth/ApplicationSession/) with hardcoded credentials. In the browser, you need to use [OAuth 2.0](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/) and have users sign directly into [ArcGIS Online](https://www.arcgis.com) or ArcGIS Enterprise.

![browser based login](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/images/authorization-screen.png)


### Resources

* [Implementing Named User Login](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/)
* [Browser-based Named User Login](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/browser-based-user-logins/)

```js
// register your own app to create a unique clientId
const clientId = "abc123"

UserSession.beginOAuth2({
  clientId,
  redirectUri: 'https://yourapp.com/authenticate.html'
})
  .then(session)
```

After the user has logged in, the `session` will keep track of individual `trustedServers` that are known to be federated and pass a token through when making requests.

```js
request(url, { authentication: session })
```

### Demos

* [OAuth 2.0 Browser](https://github.com/Esri/arcgis-rest-js/tree/master/demos/oauth2-browser)
* [Retrying Requests](https://github.com/Esri/arcgis-rest-js/tree/master/demos/oauth2-browser-retry)