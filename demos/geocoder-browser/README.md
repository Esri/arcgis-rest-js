# Running this demo

1. Make sure you run `npm run build` in the root folder to setup the dependencies
2. Register a new app on https://developers.arcgis.com
3. Add a redirect URL of `https://localhost:8080/authenticate.html` to your app.
4. Copy the `config.js.template` file, rename it to `config.js`
5. Copy your apps client id into your new `config.js` file.
6. `npm start`
7. Visit https://localhost:8080 and click "Sign In" to start the OAuth 2.0 process.
8. Start clicking buttons to send off authenticated geocoding requests.

**Note:** The server starts with a special configuration to serve URLs starting with `@esri/arcgis-rest-*` from their respective packages. In your application you will need to change these URLs to point to their respective locations.
