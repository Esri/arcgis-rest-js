# ArcGIS Rest JS / Vanilla JS Demo

This demo uses Vanilla JS to implement OAuth2 using
the `arcgis-rest-js` libraries.

See the ArcGIS Rest JS guide to [Authentication in Browser-based Apps](https://esri.github.io/arcgis-rest-js/guides/browser-authentication/) for more info.

## Running this demo

1. Run `npm run build` in the root directory
1. Register a new application using https://developers.arcgis.com/applications/new (you will be prompted to sign in or create a free account first).
1. Add a redirect URL of `http://localhost:8080/authenticate.html` to your new app.
1. Either copy the `config.js.template` file and rename it to `config.js` with your own ClientID or supply it in the prompt when the app is launched.
1. Run `npm start` to spin up the development server.
1. Visit [http://localhost:8080](http://localhost:8080).

**Note:** The server starts with a special configuration to serve URLs starting with `@esri/arcgis-rest-*` from their respective packages.
