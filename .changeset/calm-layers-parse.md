---
"@esri/arcgis-rest-feature-service": patch
---

`getService()` now parses the service URL before making the request, so passing a layer URL (e.g. `.../FeatureServer/0`) requests the service instead of the layer
