# Running this demo

1. Make sure you run `npm run build` in the root folder to setup the dependencies
2. Create and register a [new application](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/accessing-arcgis-online-services/).
3. Replace values in [config-template.js](/demos/batch-geocoder-node/config-template.js) and rename to `config.js`
   1. `"clientId"`: ArcGIS ClientId
   2. `"clientSecret"`: ArcGIS ClientSecret
   3. `"csv"`: csv path
   4. `"output"`: output csv path
   5. `"fieldmap"`: `object` that maps CSV fields to [address fields](https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-geocoding/IAddressBulk/) **or** `string` that points to a CSV field with single-line addresses
4. `npm start`

Sample Restaurant Inspections adapted from a DOHMH dataset available [online](https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/xx67-kt59/data)
