# ArcGIS Rest JS / Vanilla JS Demo

This demo shows how to trigger OAuth 2.0 using `@esri/arcgis-rest-js` _after_ an anonymous request and a `403/499` is encountered using [`ArcGISAuthError.retry()`](https://esri.github.io/arcgis-rest-js/api/request/ArcGISAuthError/#retry-summary).

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
  });
}
```
Demo - [OAuth 2.0 Browser -retry](https://github.com/Esri/arcgis-rest-js/tree/master/demos/oauth2-browser-retry)

## Running this demo
1. open `index.html` in a web browser