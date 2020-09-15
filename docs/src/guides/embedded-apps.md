---
title: Passing Authentication to iFramed apps
navTitle: Embedded Authentication
description: Learn how to pass authentication into iframe embedded applications.
order: 50
group: 2-authentication
---

**Note** This is a new api feature, and currently there are *no* platform applications that support the authentication flows discussed in this guide. However, this guide exists to help other platform app teams add this functionality to their apps.

# Authentication with Embedded Applications

Sometimes an application will need to embed another application using an `<iframe>`. If both applications are backed by items that are publicly accessible, things will just work.

But, if the "Host" application is not public and the embedded application is not public, we then run into the question of how to pass authentication from the "Host" to the embedded application.

### Cross Origin Embedding
Cross-Origin embedding occurs when the "host" app and the "embedded" application are served from different locations. This is only supported for ArcGIS Platform apps that support embedding.


For example, you can build a custom app, hosted at `http://myapp.com` and iframe in a "platform app" that supports embedding. However, you can not embed your custom app into a storymap, and expect the storymap to pass authentication to your app. This is done for security reasons.


## Using `postMessage` 
The browser's `postMessage` api is designed to allow communication between various "frames" in a page, and it is how this works internally. You can read more about [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) at the Mozilla Developer Network.

# Authentication Flow
We will walk through the flows at a high-level

## 1 Host App uses oAuth

The application acting as the host, should use oAuth to autentication the user, and *before* rendering the iframe with the embedded application it must call `session.enablePostMessageAuth(validOrigins)`. This sets up an event handler that will process the requests from the embedded applications.

The `validOrigins` argument is an array of "orgins" your app expects to get auth requests from. **NOTE** This should be a constrained list of just the domains this particular application will actually be embedding.

```js
  // register your own app to create a unique clientId
  const clientId = "abc123"

  UserSession.beginOAuth2({
    clientId,
    redirectUri: 'https://yourapp.com/authenticate.html'
  })
  .then(session => {
    // for this example we will only send auth to embeds hosted on storymaps.arcgis.com
    const validOrigins = ['https://storymaps.arcgis.com'];
    session.enablePostMessageAuth(validOrigins);
  })
```

#### 2  Host App adds params to embed url
Let's suppose the host app is embedding `https://storymaps.arcgis.com/stories/15a9b9991fff47ad84f4618a28b01afd`. To tell the embedded app that it should request authentication from the parent we need to add two url parameters:

- `embed=iframe` - tells the app it's embedded in an iframe. This allows the app to make ui changes like hiding headers etc
- `parentOrigin=https://myapp.com` - this tells the app what 'origin' to expect messages from, and also to ignore other origins. **note** this should be uri encoded

```js
const originalUrl = 'https://storymaps.arcgis.com/stories/15a9b9991fff47ad84f4618a28b01afd';
const embedUrl = `${originalurl}?embed=true&parentOrigin=${encodeURIComponent(window.location.origin)}`;
// then use embedUrl in your component that renders the <iframe>
```

#### 3 Embed App boots and Requests Auth
In the embedded application, early in it's boot sequence it should read the query string parameters and make the determintation that it is running inside an iframe, and that it can request authentication information from the parent. 

```js
  // Parse up any url params
  let params = new URLSearchParams(document.location.search.substring(1));
  const embedStyle = params.get('embed');
  const parentOrigin = params.get('parentOrigin'); 
  if (embedStyle === 'iframe' && parentOrigin) {
    UserSession.fromParent(parentOrigin)
    .then((session) => {
      // session is a UserSession instance, populated from the parent app
      // the embeded app should exchange this token for one specific to the application
    })
    .catch((ex) => {
      // if the origin of the embedded app is not in the parent's validOrigin array
      // this will throw with a message "Rejected authentication request."
    })
  }
```

#### 4 Parent App Transitions Away
If the parent app has the ability to transition to another route (i.e. an Angular, Ember, React etc app with a router) then **before** the transition occurs, the postMessage event listener must be disposed of. Unfortuately we can't automate this inside ArcGIS Rest Js as it will require using the life-cycle hooks of your application framework. The example below uses the `disconnectedCallback` that is part of the Stenci.js component life-cycle.

```js
  // Use your framework's hooks...
  disconnectedCallback () {
    // stop listening for requests from children
    state.session.disablePostMessageAuth();
  }
```


