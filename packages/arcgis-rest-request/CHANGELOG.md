## @esri/arcgis-rest-request [4.4.1](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.4.0...@esri/arcgis-rest-request@4.4.1) (2025-04-30)


### Bug Fixes

* postMessage must send a Credential that is usable by JSSDK ([#1223](https://github.com/Esri/arcgis-rest-js/issues/1223)) ([082b1c6](https://github.com/Esri/arcgis-rest-js/commit/082b1c67cfd6da8e90e29526d0bb0e03c1d9cf5b))

# @esri/arcgis-rest-request [4.4.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.3.0...@esri/arcgis-rest-request@4.4.0) (2025-04-07)


### Features

* **arcgis-rest-request:** change getDomainCredentials to handle URLs with mismatching cases ([013e4da](https://github.com/Esri/arcgis-rest-js/commit/013e4da9d62c955c316fb6be46a169462d2a245c))
* **arcgis-rest-request:** switched to using toLowerCase ([7ae474b](https://github.com/Esri/arcgis-rest-js/commit/7ae474b0bbb00e3c66cc4804ac89b67b330e2162))

# @esri/arcgis-rest-request [4.3.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.2.3...@esri/arcgis-rest-request@4.3.0) (2025-01-23)


### Features

* make API keys work with all portal methods ([#1186](https://github.com/Esri/arcgis-rest-js/issues/1186)) ([1972413](https://github.com/Esri/arcgis-rest-js/commit/1972413e1511593aff53a88b4cf2d987fd2af2a6))

## @esri/arcgis-rest-request [4.2.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.2.2...@esri/arcgis-rest-request@4.2.3) (2024-06-15)


### Bug Fixes

* update auth warning ([#1162](https://github.com/Esri/arcgis-rest-js/issues/1162)) ([fdd411b](https://github.com/Esri/arcgis-rest-js/commit/fdd411b9367a46244de7034ad4bd5b16d5d2b24b))

## @esri/arcgis-rest-request [4.2.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.2.1...@esri/arcgis-rest-request@4.2.2) (2024-06-01)


### Bug Fixes

* small change to trigger a catch-up release ([#1159](https://github.com/Esri/arcgis-rest-js/issues/1159)) ([ea1ac91](https://github.com/Esri/arcgis-rest-js/commit/ea1ac9147842cb8658d164e0962449f97ecf92f0))

## @esri/arcgis-rest-request [4.2.1](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.2.0...@esri/arcgis-rest-request@4.2.1) (2024-03-26)


### Bug Fixes

* removed owningSystemUrl from IServerInfo ([#1146](https://github.com/Esri/arcgis-rest-js/issues/1146)) ([a801537](https://github.com/Esri/arcgis-rest-js/commit/a80153702358d4ca22eb3d87eb5dc23b3f6cd123))

# @esri/arcgis-rest-request [4.2.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.1.4...@esri/arcgis-rest-request@4.2.0) (2023-05-04)


### Features

* **arcgis-rest-places:** Add support for the new Places service via a new arcgis-rest-places package ([6ee5a54](https://github.com/Esri/arcgis-rest-js/commit/6ee5a54f7f71b0590e4b905fa6de97a22f337bd9))

## @esri/arcgis-rest-request [4.1.4](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.1.3...@esri/arcgis-rest-request@4.1.4) (2023-04-28)


### Bug Fixes

* **arcgis-rest-request:** geometry type esriGeometryMultiPatch ([#1102](https://github.com/Esri/arcgis-rest-js/issues/1102)) ([b5e1aa4](https://github.com/Esri/arcgis-rest-js/commit/b5e1aa42dba39ae0322cf0b435f83409e61a8493))

## @esri/arcgis-rest-request [4.1.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.1.2...@esri/arcgis-rest-request@4.1.3) (2023-04-27)


### Bug Fixes

* **arcgis-rest-request:** fix [#1035](https://github.com/Esri/arcgis-rest-js/issues/1035) by adding parsing for generateToken endpoints on ArcGIS Server ([c0ff7a3](https://github.com/Esri/arcgis-rest-js/commit/c0ff7a384ff70b19884310cfa3cc2e7a71c9a0cd))

## @esri/arcgis-rest-request [4.1.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.1.1...@esri/arcgis-rest-request@4.1.2) (2023-03-02)


### Bug Fixes

* **arcgis-rest-request:** added social providers ([caf8d11](https://github.com/Esri/arcgis-rest-js/commit/caf8d11a61ed5b1ef715dc6f019e3ef2a36d6323))
* **arcgis-rest-request:** pass referer ([c950c4a](https://github.com/Esri/arcgis-rest-js/commit/c950c4a9112c391e5f49204233bdbef9f65582d1))
* **arcgis-rest-request:** pass referer ([81c2de8](https://github.com/Esri/arcgis-rest-js/commit/81c2de8c5f5c2508abfe795edb7cbf0fc7f59040))
* **arcgis-rest-request:** pass referer ([57de1f6](https://github.com/Esri/arcgis-rest-js/commit/57de1f64d0f86bdfeed89e09ddcb7af50c2ad4c4))
* **arcgis-rest-request:** pass referer ([5af0c3b](https://github.com/Esri/arcgis-rest-js/commit/5af0c3bec26ddf083525b24cd622ce4af79d95e4))
* **arcgis-rest-request:** pass referer ([08ec6fd](https://github.com/Esri/arcgis-rest-js/commit/08ec6fd1f0dcb24332719f7a2578fdca5ec611fa))
* **arcgis-rest-request:** pass referer ([8ba4890](https://github.com/Esri/arcgis-rest-js/commit/8ba4890b8c34101498201eca6b37f82236b15d97))

## @esri/arcgis-rest-request [4.1.1](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.1.0...@esri/arcgis-rest-request@4.1.1) (2022-10-12)


### Bug Fixes

* **arcgis-rest-request:** Added Params Preprocessor for GP Mutilvalue Inputs ([#1027](https://github.com/Esri/arcgis-rest-js/issues/1027)) ([cf75cd6](https://github.com/Esri/arcgis-rest-js/commit/cf75cd609ba3a795ef37590392cada5eab061b79))

# @esri/arcgis-rest-request [4.1.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.4...@esri/arcgis-rest-request@4.1.0) (2022-09-28)


### Features

* **arcgis-rest-request:** add a new Job class to support asynchronous long running tasks. ([9c222aa](https://github.com/Esri/arcgis-rest-js/commit/9c222aa7a4e70a4b0951438ebb83c10de1d0912e))

## @esri/arcgis-rest-request [4.0.4](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.3...@esri/arcgis-rest-request@4.0.4) (2022-09-15)


### Bug Fixes

* [#995](https://github.com/Esri/arcgis-rest-js/issues/995) and [#1006](https://github.com/Esri/arcgis-rest-js/issues/1006), issues with redirect urls ([f03ed13](https://github.com/Esri/arcgis-rest-js/commit/f03ed1382e41a04484c23ab8d28f7cf9189b55b8))

## @esri/arcgis-rest-request [4.0.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.2...@esri/arcgis-rest-request@4.0.3) (2022-05-11)


### Bug Fixes

* change all in-repo dep and peerDeps to use ranges ([8091910](https://github.com/Esri/arcgis-rest-js/commit/809191013b56dd71c394db13e6657301fce9f30f))

## @esri/arcgis-rest-request [4.0.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.1...@esri/arcgis-rest-request@4.0.2) (2022-04-27)


### Bug Fixes

* **arcgis-rest-request:** add withOptions to export ([ea3f2ec](https://github.com/Esri/arcgis-rest-js/commit/ea3f2ec495ee26b12476f8e319a26992cee92c5d))

## @esri/arcgis-rest-request [4.0.1](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.0...@esri/arcgis-rest-request@4.0.1) (2022-04-20)


### Bug Fixes

* update package versions post v4 launch ([2560c34](https://github.com/Esri/arcgis-rest-js/commit/2560c34b77e718ed2dd95411d1aabcf2a9d9cb57))

# @esri/arcgis-rest-request [4.0.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@3.4.3...@esri/arcgis-rest-request@4.0.0) (2022-04-18)


### Bug Fixes

* **arcgis-rest-request:** add support for server credentials ([#965](https://github.com/Esri/arcgis-rest-js/issues/965)) ([b063bcc](https://github.com/Esri/arcgis-rest-js/commit/b063bcca1780cd671e6b4f25532e4122903dc8b2))
* **arcgis-rest-request:** fixes an issue in append custom params where valid params of value 0 were ([4a63dd7](https://github.com/Esri/arcgis-rest-js/commit/4a63dd76a2f39bffbf99745fb7a81f2a8353c666))
* add package.json files to builds for individual build types ([#955](https://github.com/Esri/arcgis-rest-js/issues/955)) ([c162125](https://github.com/Esri/arcgis-rest-js/commit/c16212594f0b914425548be5d61d7435d54a2718))


### Features

* add breaking change ([8205840](https://github.com/Esri/arcgis-rest-js/commit/8205840d81106173fdb1fe3750822e1754611c3b))
* **arcgis-rest-request:** add demo and code for ability to share session between client and server ([ee9ac4c](https://github.com/Esri/arcgis-rest-js/commit/ee9ac4c5a0de48d8820c15d661b544ed38a7abf7))
* **arcgis-rest-request:** add support for AbortSignal ([#970](https://github.com/Esri/arcgis-rest-js/issues/970)) ([0f314f6](https://github.com/Esri/arcgis-rest-js/commit/0f314f689dbb7802431ef52223a53b121c346739))
* **arcgis-rest-request:** allow state variable to be passed through on server side oauth ([fdbe612](https://github.com/Esri/arcgis-rest-js/commit/fdbe612e103250b33f85d61aa5e30daa496f74e8))
* **arcgis-rest-request:** force dep release ([87c511d](https://github.com/Esri/arcgis-rest-js/commit/87c511d2da9d6a584b6b9ee7f2b4ce68d808e6fe))
* **arcgis-rest-request:** force release ([9acfacc](https://github.com/Esri/arcgis-rest-js/commit/9acfacc34cdeb3c0e45697484ef3bad156be57e6))
* **arcgis-rest-request:** refresh session and retry with new token for invalid token errors ([54df4ca](https://github.com/Esri/arcgis-rest-js/commit/54df4caef91c8a07f7080badefead4131628e1b5))
* **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))


### BREAKING CHANGES

* force 4.x release





### Dependencies

* **@esri/arcgis-rest-fetch:** upgraded to 4.0.0
* **@esri/arcgis-rest-form-data:** upgraded to 4.0.0

# @esri/arcgis-rest-request [4.0.0-beta.7](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.0-beta.6...@esri/arcgis-rest-request@4.0.0-beta.7) (2022-03-29)


### Features

* **arcgis-rest-request:** add support for AbortSignal ([#970](https://github.com/Esri/arcgis-rest-js/issues/970)) ([0f314f6](https://github.com/Esri/arcgis-rest-js/commit/0f314f689dbb7802431ef52223a53b121c346739))

# @esri/arcgis-rest-request [4.0.0-beta.6](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.0-beta.5...@esri/arcgis-rest-request@4.0.0-beta.6) (2022-03-22)


### Bug Fixes

* **arcgis-rest-request:** add support for server credentials ([#965](https://github.com/Esri/arcgis-rest-js/issues/965)) ([b063bcc](https://github.com/Esri/arcgis-rest-js/commit/b063bcca1780cd671e6b4f25532e4122903dc8b2))

# @esri/arcgis-rest-request [4.0.0-beta.5](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.0-beta.4...@esri/arcgis-rest-request@4.0.0-beta.5) (2022-03-16)


### Features

* **arcgis-rest-request:** allow state variable to be passed through on server side oauth ([fdbe612](https://github.com/Esri/arcgis-rest-js/commit/fdbe612e103250b33f85d61aa5e30daa496f74e8))

# @esri/arcgis-rest-request [4.0.0-beta.4](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.0-beta.3...@esri/arcgis-rest-request@4.0.0-beta.4) (2022-03-14)


### Features

* **arcgis-rest-request:** add demo and code for ability to share session between client and server ([ee9ac4c](https://github.com/Esri/arcgis-rest-js/commit/ee9ac4c5a0de48d8820c15d661b544ed38a7abf7))

# @esri/arcgis-rest-request [4.0.0-beta.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.0-beta.2...@esri/arcgis-rest-request@4.0.0-beta.3) (2022-03-10)


### Bug Fixes

* add package.json files to builds for individual build types ([#955](https://github.com/Esri/arcgis-rest-js/issues/955)) ([c162125](https://github.com/Esri/arcgis-rest-js/commit/c16212594f0b914425548be5d61d7435d54a2718))


### Features

* **arcgis-rest-request:** refresh session and retry with new token for invalid token errors ([54df4ca](https://github.com/Esri/arcgis-rest-js/commit/54df4caef91c8a07f7080badefead4131628e1b5))

# @esri/arcgis-rest-request [4.0.0-beta.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-request@4.0.0-beta.1...@esri/arcgis-rest-request@4.0.0-beta.2) (2022-03-02)


### Features

* **arcgis-rest-request:** force release ([9acfacc](https://github.com/Esri/arcgis-rest-js/commit/9acfacc34cdeb3c0e45697484ef3bad156be57e6))
* **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))
