# ArcGIS REST JS Express Advanced oAuth 2.0 Demo

This demo shows some more advanced uses of authentication features in ArcGIS REST JS. Specifically:

1. Performing server based oAuth 2.0 to obtain a refresh token store the resulting token and refresh token in a session object on the server that can be looked up via an encrypted cookie.
2. Sending the short lived token information to hydrate `ArcGISIdentityManager` in a client side environment while keeping the refresh token secure on the server.
3. Customizing `ArcGISIdentityManager` to ask the server for a new short lived token when one is needed
4. Storing a session id in the in an encrypted cookie.
5. Syncing the `ArcGISIdentityManager` based auth to JS API `IdentityManager` based auth to load private content like web maps.

This demo showcases several security best practices:

- Only the encrypted session id is stored on the client in a cookie.
- Session information is encrypted when it is stored on disk on the server.
- Only short lived tokens (30 minutes) are used on the client, new tokens are requested from the server automatically.
- The refresh token on the server is valid for 2 weeks the default but is extended for another 2 weeks every time the user access the app.

Using long lived sessions on the server also means that the server can perform background work for the user such as scheduled jobs.

## Setup with provided credentials

These instructions are for setting up the demo using credentials setup by the ArcGIS REST JS team.

1. Make sure you run `npm run build` in the root folder to setup the dependencies
1. Copy `.env.template` to `.env`
1. Run `npm run start`
1. Visit http://localhost:3000 to start.

## Setup with your own credentials

These instructions are for setting up the demo using credentials setup by the ArcGIS REST JS team.

1. Make sure you run `npm run build` in the root folder to setup the dependencies
1. Copy `.env.template` to `.env`
1. [Register an app](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/tutorials/register-your-application/) and copy the Client ID into `.env` in the `CLIENT_ID` property.
1. [Add redirect URIs](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/tutorials/add-redirect-uri/) for `http://localhost:3000/authenticate` to your registered application.
1. Replace the `ENCRYPTION_KEY` and `SESSION_SECRET` values with new values. You can use a website like https://randomkeygen.com/ to generate new strong keys.
1. Run `npm run start`
1. Visit http://localhost:3000 to start.

## How it works

1. At the start of every request received express will check if a secure "session cookie" was sent along with the request.
2. If a session cookie is found it will contain a session ID that will correspond with an encrypted data file that represents some data stored for that unique session. The contents of this file are passed through the `decode` method in the session configuration an an `ArcGISIdentityManager` instance is created.
3. The handler for the request runs. You can access the `ArcGISIdentityManager` object from `request.session.arcgis`.
4. At the end of the request the value of `request.session` is run through the `encode` option on the session configuration and saved back to disk.
5. In the application route the session is converted to a plain object, the refresh token is removed and the resulting object embedded in the client code.
6. On the client we can customize the behavior of how `ArcGISIdentityManager` by subclassing it so that it so that it refreshes tokens when they expire by getting a new token from our server.
7. The client can hydrate the custom subclass of `ArcGISIdentityManager` and use it for requests.
8. When the client needs to refresh the token it will call the custom `refreshCredentials` method which will call the server. The server will get a new token and send it to the client and the client will update and retry the request with the new token.
