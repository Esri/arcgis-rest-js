---
title: Browser-based authentication with ArcGIS REST JS
navTitle: Browser-based OAuth 2.0
description: Learn how to authenticate users with ArcGIS REST JS and OAuth 2.0 in a browser.
order: 1
group: 2-authentication
---

# Authentication in Browser-based Apps

In the [Node.js](../node/) guide we explained how to instantiate a [`UserSession`](/arcgis-rest-js/api/auth/UserSession/) with hardcoded credentials.

```js
// you should never share a browser app that contain sensitive credentials
const authentication = new UserSession({
  username: "jsmith",
  password: "123456"
})
```

Instead, you need to use [OAuth 2.0](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/), so that your users can sign directly in to https://www.arcgis.com or ArcGIS Enterprise.

```js
// you need to register your own app to create a clientId
const clientId = "abc123"

UserSession.beginOAuth2({
  clientId,
  redirectUri: 'https://yourapp.com/authenticate.html'
})
  .then(session)
```

![browser based login](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/images/authorization-screen.png)

After they've signed in the `session` will keep track of individual `trustedServers` that are known to be federated.

Demo - [OAuth 2.0 Browser](https://github.com/Esri/arcgis-rest-js/tree/master/demos/oauth2-browser)

## Retrying requests

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

appendSession = () => {
  return UserSession.beginOAuth2({
    clientId,
    redirectUri: 'https://yourapp.com/authenticate.html'
  })
  .then(session) {
    return session
  })
}
```
Demo - [OAuth 2.0 Browser -retry](https://github.com/Esri/arcgis-rest-js/tree/master/demos/oauth2-browser-retry)