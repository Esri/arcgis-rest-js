---
"@esri/arcgis-rest-request": minor
---

`ArcGISIdentityManager` now emits a `tokenUpdated` event whenever its `token` (and `refreshToken` when exchanged) changes, for example after an automatic refresh. Use the new `on()`, `once()` and `off()` methods to listen for it and persist the updated credentials.
