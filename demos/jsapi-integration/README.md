# Passing authentication to the JSAPI

This demo shows how to use `arcgis-rest-js` with the ArcGIS API for JavaScript. A typical use case would be when you need to query items or feature data _before_ you are ready to display a map or scene view. In this scenario, you should load the light-weight `arcgis-rest-js` libraries first and use them to perform your queries and/or authenticate with the ArcGIS platform. Then when you are ready to show a map or scene view, you would lazy-load the ArcGIS API for JavaScript with something like [esri-loader](https://github.com/Esri/esri-loader) and use it to create the map.

## Running this demo

1. Run `npm run build` in the repository's root directory.
1. Run `npm start` to spin up the development server.
1. Visit [http://localhost:8080](http://localhost:8080).

```js
// from rest-js
const session = new ArcGISIdentityManager(/* */);

// ensure that our session has a token
session.getToken("https://www.arcgis.com/sharing/rest").then(() => {
  esriId.registerToken(session.toCredential()); // JSAPI Identity Manager
});

// from jsapi
esriId.getCredential("https://www.arcgis.com/sharing/rest").then((cred) => {
  const serverInfo = esriId.findServerInfo(
    "https://www.arcgis.com/sharing/rest"
  );
  const session = ArcGISIdentityManager.fromCredential(cred, serverInfo);
});
```

**Note:** The server starts with a special configuration to serve URLs starting with `@esri/arcgis-rest-*` from their respective packages. In your application you will need to change these URLs to point to their respective locations.
