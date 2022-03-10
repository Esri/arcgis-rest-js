# @esri/arcgis-rest-feature-service [4.0.0-beta.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-feature-service@4.0.0-beta.2...@esri/arcgis-rest-feature-service@4.0.0-beta.3) (2022-03-10)


### Bug Fixes

* add package.json files to builds for individual build types ([#955](https://github.com/Esri/arcgis-rest-js/issues/955)) ([c162125](https://github.com/Esri/arcgis-rest-js/commit/c16212594f0b914425548be5d61d7435d54a2718))





### Dependencies

* **@esri/arcgis-rest-portal:** upgraded to 4.0.0-beta.3
* **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.3

# @esri/arcgis-rest-feature-service [4.0.0-beta.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-feature-service@4.0.0-beta.1...@esri/arcgis-rest-feature-service@4.0.0-beta.2) (2022-03-02)


### Features

* **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))





### Dependencies

* **@esri/arcgis-rest-portal:** upgraded to 4.0.0-beta.2
* **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.2

# @esri/arcgis-rest-feature-service 1.0.0-beta.1 (2022-02-17)


### Bug Fixes

* **:basecamp::** ensure decodeValues() isnt derailled by attributes not present in metadata ([e9b4581](https://github.com/Esri/arcgis-rest-js/commit/e9b4581fe803757d146fb1b63a5fa51d74a3b8a9))
* **:bathtub::** ensure add/update/deleteFeatures dont pass extraneous parameters ([8566860](https://github.com/Esri/arcgis-rest-js/commit/8566860554beb32e87c4b9b28b40138b7ac70b80))
* **enterprise:** fetch fresh token manually when u/pw are provided ([299f3c0](https://github.com/Esri/arcgis-rest-js/commit/299f3c0da043b74113310cba9a3e9a0f77afa921)), closes [#161](https://github.com/Esri/arcgis-rest-js/issues/161)
* **query features:** add count and extent to IQueryFeaturesResponse ([2ab9f33](https://github.com/Esri/arcgis-rest-js/commit/2ab9f339f746e79beb06301e2c5e967d8c5135a2))


### Code Refactoring

* deprecate common-types package (in favor of common) ([6ab2e75](https://github.com/Esri/arcgis-rest-js/commit/6ab2e75a3b57ce77391da7f2a16ab57a3e781000))
* deprecate feature-service-admin package (and bundle code in feature-service) ([f5a17b1](https://github.com/Esri/arcgis-rest-js/commit/f5a17b1c93e1e5d2efd62c957bba0203088aa57a))
* rename esriGeometryType interface GeometryType ([1057850](https://github.com/Esri/arcgis-rest-js/commit/1057850012203f38def46568b1cad20ed5568f2b))
* replace items, groups, sharing and user packages with single portal package ([64a3fd9](https://github.com/Esri/arcgis-rest-js/commit/64a3fd9a8a6824d388acb773ca0ffe8900e476f8))
* stop reexporting appendCustomParams from feature-service package ([c0852cb](https://github.com/Esri/arcgis-rest-js/commit/c0852cbe9eb43e0a872498f639a0f3276ad7c5be))


### Features

* **:angola::** start with utility function to format cvd codes ([717404f](https://github.com/Esri/arcgis-rest-js/commit/717404f9827ebe4282fb43ace7df048a6ab679b1))
* **all packages:** start shipping an unminified UMD for each package ([52043f5](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5)), closes [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
* **request:** adds option to return the raw fetch response ([6fb7c79](https://github.com/Esri/arcgis-rest-js/commit/6fb7c792f4aab585a06bb1178b41a8687eabc419)), closes [#462](https://github.com/Esri/arcgis-rest-js/issues/462)
* by default fetch metadata and make query response readable ([3c96fce](https://github.com/Esri/arcgis-rest-js/commit/3c96fce874f82d0cf56294b7b665cc87980ef5f8)), closes [#375](https://github.com/Esri/arcgis-rest-js/issues/375)


### BREAKING CHANGES

* replace items, groups, sharing and user packages with single portal package
* deprecate feature-service-admin package (and bundle code in feature-service)
* deprecate common-types package (in favor of common)
* rename esriGeometryType interface GeometryType
* appendCustomParams is no longer exported by feature-service package





### Dependencies

* **@esri/arcgis-rest-portal:** upgraded to 1.0.0-beta.1
* **@esri/arcgis-rest-request:** upgraded to 1.0.0-beta.1
