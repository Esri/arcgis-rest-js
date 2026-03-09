---
"@esri/arcgis-rest-feature-service": patch
---

Add support for `maxRecordCountFactor` in `queryFeatures()` and `queryAllFeatures()`. Fix a bug in `queryAllFeatures()` could end up requesting too few features per page.
