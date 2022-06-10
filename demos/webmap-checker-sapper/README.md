# Web map checker

This app demonstrates the use of ArcGIS REST JS with [sapper](https://sapper.svelte.technology/) a cutting edge web framework. [sapper is built on the [svelte](https://svelte.technology) component library and is a universal app framework that supports both client and server side rendering.

You may want to use a universal framework in your app for a few reasons:

1. Better SEO, because the app is rendered on the server search engines like Google can read the content and index your pages without using JavaScript.
2. Very fast performance. Because the app is rendered on the server browsers will render the initial HTML on the page providing a very fast experience, then JavaScript loads making the app interactive.
3. Server based sign in experiences can have longer sessions with less logins.
4. You might want access to a users token on the server side to perform background tasks like monitoring or data processing.
5. Increased security. In this example a users token is never stored on the client. Instead a a secure cookie is used on the client that pairs with an encrypted session store on the server. The client only gets short lived access tokens and is expected to frequently refresh them.

Since ArcGIS REST JS works on both the client and the server it is ideal for use in universal app frameworks.

Sapper is still in alpha and should not be used for production. However there are other universal app frameworks like [Nuxt](https://nuxtjs.org/) (Vue JS) and Next](https://nextjs.org/) (React)

## App Overview

Sapper works by starting up an [Express JS](https://expressjs.com/) web server and creating a route for each of the files in `src/routes`. Files ending in `.js` are API endpoints and files ending in `.html` are rendered as Svelte components.

The app has 4 API endpoints

* `src/routes/auth/authorize.js` - starts the OAuth 2.0 process to sign in a user.
* `src/routes/auth/post-sign-in.js` - completes the OAuth 2.0 process.
* `src/routes/auth/exchange-token.js` - provides a fresh token based on the secure session cookie when the current token expires.
* `src/routes/auth/sign-out.js` - signs the user out, destroying the saved session on the server and the session cookie on the client.

and 3 Svelte routes:

* `src/routes/index.html` - renders the main page for signed out users which shows a sign in buttons.
* `src/routes/webmaps/index.html` - renders a list of the users web maps
* `src/routes/webmaps/[webmapId].html` - renders a detailed view for a web map. The brackets indicate what will be replaced by an actual URL like `/webmaps/c7f2cdb8638147b0b5b792bcee800b48`

The `server.js` file defines the server and sets up [`express-session`](https://www.npmjs.com/package/express-session) with [`session-file-store`](https://www.npmjs.com/package/session-file-store) as well as defining the server side Svelte `Store` used to power the server side rendering.

`client.js` consumes the server side Svelte `Store` and uses it to hydrate the client side `Store`.

Once the app boots subsequent navigation by the user is handled client side by Svelte for better performance.

This app is based on https://github.com/sveltejs/sapper-template.

## Running this demo

1. Like all the other demo apps, run `npm run bootstrap` in the root directory.
1. `cd demos/webmap-checker-sapper`
1. Create a `.env` file at the root of the `webmap-checker-sapper` folder that contains the following:

   ```text
   CLIENT_ID=YfFEWoHwtOY4KP1t
   REDIRECT_URI=http://localhost:3000/auth/post-sign-in
   ENCRYPTION_KEY=vf00tpMiGRSCO36yrbNm9jWyAStIJWJ5
   SESSION_SECRET=Sb66uSlcA3RqyIXLOtwK5P1a37FvYqHD
   PORT=3000
   ```

   **Use these values only for development and testing out the demo.**
1. `npm run dev`

## Configuration

There are five config values stored in `.env`:

* `CLIENT_ID` - The client id from an app registered in ArcGIS Online. Directions for setting this up are part of the [named user login documentation](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/arcgis-identity/).
* `REDIRECT_URL` - A valid redirect URL from the app that owns the `CLIENT_ID`. Directions for setting this up are part of the [named user login documentation](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/arcgis-identity/). This demo provides the route `/auth/post-sign-in` for this purpose.
* `ENCRYPTION_KEY` - Any string, but preferably a secure key from somewhere like https://randomkeygen.com/.
* `SESSION_SECRET` - Any string, but preferably a secure key from somewhere like https://randomkeygen.com/.
* `PORT` - The port to run the development server on.

## Authentication Workflow

This sample differs from other workflows in how authentication works but shows the flexibility of the ArcGIS REST JS library to perform server based authentication, store sessions on the server and seamlessly share sessions with the client and [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/).

1. First a user sign in with OAuth 2.0. This starts by sending the user to `/auth/authorize`:

   ```html
   <a href="/auth/authorize">Sign in to get stared</a>
   ```

2. Inside the `/auth/authorize` endpoint we call [`UserSession.authorize()`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/#authorize) to start the OAuth 2.0 login process. This redirects the user to the ArcGIS Online authorization page where they will sign in with their ArcGIS Online account.
3. After the user signs in with their ArcGIS Online account they are redirected back the app at the configured redirect URL which is `/auth/post-sign-in`. We then call [`UserSession.exchangeAuthorizationCode()`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/#exchangeAuthorizationCode) which finishes the authroization workflow and returns a [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/) that we can use to authenticate subsequent requests. In order to persist the session we assign it to `request.session.userSession` which triggers the [Express session middleware](https://github.com/expressjs/session). `/auth/post-sign-in` finishes by redirecting the user to `/webmaps` which is the main landing page of the app.
4. When `/auth/post-sign-in` finishes the session middleware saves the values assigned to `request.session` which includes our [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/). The session middleware uses a defined store (in this case [`session-file-store`](https://www.npmjs.com/package/session-file-store)) to serialize and encrypt the session to a file on disk. Then the session middleware sets a cookie on the client. On subsequent requests the session middleware will use the cookie to lookup the encrypted session and rehydrate our [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/).
5. Since we also need access ot our [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/) on the client we can use [`UserSession.toJSON()`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/#toJSON) method to convert it to a JSON object that can be serialized and sent to the client. Since our server-side session includes a refresh token we also need to delete the refresh token from the session before sending it to the client. The serialized session is sent to the client via sappers `Store` class.
6. On the client the serialized session is recreated and can now be used for requests on the client.
7. Since sessions on the client are short lived (they expire after a few hours) we need a mechanism to refresh the client side session with a new token if the old token expires. This needs to work seamlessly even in the middle of a series of requests. ArcGIS REST JS provides an easy mechanism to do this. Consider the following request:

   ```js
   getItem(webmapId, {
     authentication: userSession // userSession is expired
   }).catch(error => {
     // handle the error
   })
   ```

   `error` will be an instance of either [`ArcGISRequestError`](https://esri.github.io/arcgis-rest-js/api/request/ArcGISRequestError/) or [`ArcGISAuthError`](https://esri.github.io/arcgis-rest-js/api/request/ArcGISAuthError/). `ArcGISAuthError` includes a special `retry()` method that can accept a new session and retry the request. You can then implement your logic to refresh a session and retry the request as in this example:

   ```js
   getItem(webmapId, {
     authentication: userSession // userSession is expired
   }).catch(error => {
     if (error.name === "ArcGISAuthError") {
       return methodThatRefreshesSession(error).then((newSession) => {
         return error.retry(newSession);
       });
     }

     throw error; // otherwise rethrow the error so we can handle it in a later catch
   }).then(response => {
     // handle a successful response.
   }).catch(error => {
     // handle an actual request failure or error.
   });
   ```

8. The retry workflow is handled entirely by a simple utility function called `retryWithNewSession()`. In order to get a new token a request is made to `/auth/exchange-token`. This request includes the session cookie so the server can find the instance of [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/) and call [`UserSession.refreshSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/#refreshSession) to refresh the session, strip out the refresh token and return the new session to the client which then retries the request with the new authentication.
9. In order to load the web maps, we also need to pass our [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/) to the ArcGIS API for JavaScript [`IdentityManager`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html) to allow it to load resources that require authentication. You can use [`UserSession.toCredential()`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/#toCredential-summary) to convert the session into a [`Credential`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-Credential.html) to pass to [`IdentityManager`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html) as shown below:

   ```js
   require([
     "esri/identity/IdentityManager"
   ], function (esriId){
       esriId.registerToken(session.toCredential());
   });
   ```

   New credentials should also be registered with [`IdentityManager`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html) when they are retrieved from the server as older sessions expire.
