# ArcGIS Rest JS / Vanilla JS Demo

This demo uses Vanilla JS to implement OAuth2 using the `arcgis-rest-js` libraries.

See the ArcGIS Rest JS guide to [Authentication in Browser-based Apps](https://developers.arcgis.com/arcgis-rest-js/authentication/tutorials/implement-user-authentication-rest-js-browser/) for more info.

## Running this demo

1. Run `npm run build` in the root directory
1. Run `npm start` in this directory to spin up the development server.
1. Visit [http://localhost:8080](http://localhost:8080).

The demo will run using an application configured by the ArcGIS REST JS team.

## Running with your own credentials

1. Run `npm run build` in the root directory
1. [Register an app](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/tutorials/register-your-application/) and copy the Client ID into `config.js` in the `clientId` property.
1. [Add redirect URIs](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/tutorials/add-redirect-uri/) for `http://localhost:8080` (for inline redirects) and `http://localhost:8080/authentication.html` (for popup redirects) to your registered application.
1. Run `npm start` in this directory to spin up the development server.
1. Visit [http://localhost:8080](http://localhost:8080).

---

**Note:** The server starts with a special configuration to serve URLs starting with `@esri/arcgis-rest-*` from their respective packages. In your application you will need to change these URLs to point to their respective locations.
