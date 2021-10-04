# ArcGIS Rest JS / Vanilla JS Demo

This demo shows how to trigger OAuth 2.0 using ArcGIS REST JS _after_ an anonymous request and a `403/499` is encountered using [`ArcGISAuthError.retry()`](https://esri.github.io/arcgis-rest-js/api/request/ArcGISAuthError/#retry-summary).

```js
request(url).catch((err) => {
  if (err.name === "ArcGISAuthError") {
    // make the same request again with a UserSession
    err.retry(appendSession).then((response) => console.log(response));
  }
});

appendSession = () => {
  return UserSession.beginOAuth2({
    clientId,
    redirectUri: "https://yourapp.com/authenticate.html"
  });
};
```

Demo - [OAuth 2.0 Browser -retry](https://github.com/Esri/arcgis-rest-js/tree/master/demos/oauth2-browser-retry)

## Running this demo

1. Run `npm run build` in the root directory
1. Register a new application using https://developers.arcgis.com/applications/new (you will be prompted to sign in or create a free account first).
1. Add a redirect URL of `http://localhost:8080/authenticate.html` to your new app.
1. Either copy the `config.js.template` file and rename it to `config.js` with your own ClientID or supply it in the prompt when the app is launched.
1. Run `npm start` to spin up the development server.
1. Visit [http://localhost:8080](http://localhost:8080).

**Note:** The server starts with a special configuration to serve URLs starting with `@esri/arcgis-rest-*` from their respective packages. In your application you will need to change these URLs to point to their respective locations.
