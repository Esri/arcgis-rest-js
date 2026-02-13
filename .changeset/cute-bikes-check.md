---
"@esri/arcgis-rest-feature-service": minor
---

Added query params where user can query a pbf request and get back geojson or arcgis features.
- User can request features from feature service using "f: pbf-as-geojson" or "f: pbf-as-arcgis" in request options
- Added EsriFeatureCollection proto spec and modular pbf decoder
- Added pbfToGeoJSON parser and pbfToArcGIS parser
- Added Live Tests 
