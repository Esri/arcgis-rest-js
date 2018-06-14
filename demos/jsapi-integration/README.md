# Passing authentication to the JSAPI

This demo shows how to use `arcgis-rest-js` with  the ArcGIS API for JavaScript. A typical use case would be when you need to query items or feature data _before_ you are ready to display a map or scene view. In this scenario, you should load the light-weight `arcgis-rest-js` libraries first and use them to perform your queries and/or authenticate with the ArcGIS platform. Then when you are ready to show a map or scene view, you would lazy-load the ArcGIS API for JavaScript with something like [esri-loader](https://github.com/Esri/esri-loader) and use it to create the map. 

## Running this demo
1. Run `npm run bootstrap` in the repository's root directory.
1. Run `npm start` to spin up the development server.
1. Visit [http://localhost:8080](http://localhost:8080).
