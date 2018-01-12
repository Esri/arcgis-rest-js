# Running this demo

:loudspeaker: Node.js 8.6 or higher is [required](http://node.green/), this demo uses a couple shiny new JS features like `{... }`

1. Make sure you run `npm run bootstrap` in the root folder to setup the dependencies
2. Replace values in [config-template.js](/demos/batch-geocoder/config-template.js) and rename to `config.js`
   1. `"un"`: ArcGIS username
   2. `"pw"`: ArcGIS password
   3. `"csv"`: csv path
   4. `"output"`: output csv path
   5. `"fieldmap"`: `object` that maps CSV fields to [address fields](https://esri.github.io/arcgis-rest-js/api/geocoder/IAddressBulk/) __or__ `string` that points to a CSV field with single-line addresses
3. `node batch-geocode.js`
