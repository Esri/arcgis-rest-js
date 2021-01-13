---
title: Passing Authentication to iFramed apps
navTitle: Embedded Authentication
description: Learn how to pass authentication into iframe embedded applications.
order: 50
group: 2-authentication
---

**Note** This is a new api feature, and currently there are _no_ platform applications that support the authentication flows discussed in this guide. However, this guide exists to help other platform app teams add this functionality to their apps.

# Authentication with Embedded Applications

Sometimes an application will need to embed another application using an `<iframe>`. If both applications are backed by items that are publicly accessible, things will just work.

However, if the embedded application is not public and the user has already logged into the "Host" application, we then run into the question of how to pass authentication from the "Host" to the embedded application.

# Message Types and Objects

Although this is internalized within the functions, the message types and the objects are documented in the repo in the [postMessage Auth Spec document](https://github.com/Esri/arcgis-rest-js/tree/master/packages/arcgis-rest-auth/post-message-auth-spec.md)

### Cross Origin Embedding

Cross-Origin embedding occurs when the "host" app and the "embedded" application are served from different locations. This is only supported for ArcGIS Platform apps that support embedding.

For example, you can build a custom app, hosted at `http://myapp.com` and iframe in a "platform app" that supports embedding. However, you can not embed your custom app into a storymap, and expect the storymap to pass authentication to your app. This is done for security reasons.

## Using `postMessage`

The browser's `postMessage` api is designed to allow communication between various "frames" in a page, and it is how this works internally. You can read more about [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) at the Mozilla Developer Network.

# Authentication Flow

We will walk through the flows at a high-level

## 1 Host App uses oAuth

The application acting as the host, should use oAuth to authenticate the user, and _before_ rendering the iframe with the embedded application it must call `session.enablePostMessageAuth(validOrigins)`. This sets up a listener that will process the requests from the embedded application(s).

The `validOrigins` argument is an array of "orgins" your app expects to get auth requests from. **NOTE** This should be a constrained list of just the domains this particular application will actually be embedding.

```js
// register your own app to create a unique clientId
const clientId = "abc123";

UserSession.beginOAuth2({
  clientId,
  redirectUri: "https://yourapp.com/authenticate.html",
}).then((session) => {
  // for this example we will only send auth to embeds hosted on storymaps.arcgis.com
  const validOrigins = ["https://storymaps.arcgis.com"];
  session.enablePostMessageAuth(validOrigins);
});
```

#### 2 Host App adds params to embed url

Let's suppose the host app is embedding `https://storymaps.arcgis.com/stories/15a9b9991fff47ad84f4618a28b01afd`. To tell the embedded app that it should request authentication from the parent we need to add two url parameters:

- `arcgis-auth-origin=https://myapp.com` - This tells the app it's embedded in an iframe and should request auth from the parent, and what 'origin' to expect messages from, what origin to post messages to, and also to ignore other origins. **note** this should be uri encoded

```js
const originalUrl =
  "https://storymaps.arcgis.com/stories/15a9b9991fff47ad84f4618a28b01afd";
const embedUrl = `${originalurl}?arcgis-auth-origin=${encodeURIComponent(
  window.location.origin
)}`;
// then use embedUrl in your component that renders the <iframe>
```

#### 3 Embed App boots and Requests Auth

In the embedded application, early in it's boot sequence it should read the query string parameters and make the determintation that it is running inside an iframe, and that it can request authentication information from the parent.

```js
// Parse up any url params
let params = new URLSearchParams(document.location.search.substring(1));
const arcgisAuthOrigin = params.get("arcgis-auth-origin");
if (arcgisAuthOrigin) {
  UserSession.fromParent(arcgisAuthOrigin)
    .then((session) => {
      // session is a UserSession instance, populated from the parent app
      // the embeded app should exchange this token for one specific to the application
    })
    .catch((ex) => {
      // if the origin of the embedded app is not in the parent's validOrigin array
      // this will throw with a message "Rejected authentication request."
    });
}
```

#### Clean up

While rest-js will attempt to clean up the listeners automatically, if the host application is no longer going to render the iframe before the embedded app has had a chance to request the authentication, then the app should manually clean up the listener by calling `session.disablePostMessageAuth()`

Typically you would make this call in the life-cycle hooks of your application framework (i.e. an Angular, Ember, React etc app with a router). The example below uses the `disconnectedCallback` that is part of the Stenci.js component life-cycle.

```js
  // Use your framework's hooks...
  disconnectedCallback () {
    // stop listening for requests from children
    state.session.disablePostMessageAuth();
  }
```
