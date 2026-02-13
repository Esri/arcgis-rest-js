# @esri/arcgis-rest-auth Changelog

## 4.9.0

### Patch Changes

- Updated dependencies [052ff8e]
- Updated dependencies [51e8144]
  - @esri/arcgis-rest-request@4.9.0

## 4.8.0

### Minor Changes

- 93db38b: Initial bump to migrate to changesets.

### Patch Changes

- Updated dependencies [93db38b]
  - @esri/arcgis-rest-request@4.8.0

## @esri/arcgis-rest-auth [4.0.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-auth@4.0.1...@esri/arcgis-rest-auth@4.0.2) (2022-05-11)

### Bug Fixes

- change all in-repo dep and peerDeps to use ranges ([8091910](https://github.com/Esri/arcgis-rest-js/commit/809191013b56dd71c394db13e6657301fce9f30f))

## @esri/arcgis-rest-auth [4.0.1](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-auth@4.0.0...@esri/arcgis-rest-auth@4.0.1) (2022-04-20)

### Bug Fixes

- update package versions post v4 launch ([2560c34](https://github.com/Esri/arcgis-rest-js/commit/2560c34b77e718ed2dd95411d1aabcf2a9d9cb57))

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.1

## @esri/arcgis-rest-auth [4.0.0](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-auth@3.4.3...@esri/arcgis-rest-auth@4.0.0) (2022-04-18)

### Bug Fixes

- **arcgis-rest-request:** add support for server credentials ([#965](https://github.com/Esri/arcgis-rest-js/issues/965)) ([b063bcc](https://github.com/Esri/arcgis-rest-js/commit/b063bcca1780cd671e6b4f25532e4122903dc8b2))
- add package.json files to builds for individual build types ([#955](https://github.com/Esri/arcgis-rest-js/issues/955)) ([c162125](https://github.com/Esri/arcgis-rest-js/commit/c16212594f0b914425548be5d61d7435d54a2718))

### Features

- add breaking change ([8205840](https://github.com/Esri/arcgis-rest-js/commit/8205840d81106173fdb1fe3750822e1754611c3b))
- **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))

### BREAKING CHANGES

- force 4.x release

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.0

## @esri/arcgis-rest-auth [4.0.0-beta.4](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-auth@4.0.0-beta.3...@esri/arcgis-rest-auth@4.0.0-beta.4) (2022-03-22)

### Bug Fixes

- **arcgis-rest-request:** add support for server credentials ([#965](https://github.com/Esri/arcgis-rest-js/issues/965)) ([b063bcc](https://github.com/Esri/arcgis-rest-js/commit/b063bcca1780cd671e6b4f25532e4122903dc8b2))

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.6

## @esri/arcgis-rest-auth [4.0.0-beta.3](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-auth@4.0.0-beta.2...@esri/arcgis-rest-auth@4.0.0-beta.3) (2022-03-10)

### Bug Fixes

- add package.json files to builds for individual build types ([#955](https://github.com/Esri/arcgis-rest-js/issues/955)) ([c162125](https://github.com/Esri/arcgis-rest-js/commit/c16212594f0b914425548be5d61d7435d54a2718))

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.3

## @esri/arcgis-rest-auth [4.0.0-beta.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-auth@4.0.0-beta.1...@esri/arcgis-rest-auth@4.0.0-beta.2) (2022-03-02)

### Features

- **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.2

## @esri/arcgis-rest-auth 1.0.0-beta.1 (2022-02-17)

### Bug Fixes

- switch to eslint, fix minor issues, disable other rules ([ab47412](https://github.com/Esri/arcgis-rest-js/commit/ab474123d3a056dcd52a8898f39f287893626f35))
- **arcgis-rest-auth:** export validateAppAccess ([6d1e2ef](https://github.com/Esri/arcgis-rest-js/commit/6d1e2ef012ca25464e6219b5d909a30e5f1cecee))
- **arcgis-rest-auth:** postMessage internals ([bd8eb6c](https://github.com/Esri/arcgis-rest-js/commit/bd8eb6c0363483209645c5cc7cf19ad1a8114cc6))
- **UserSession:** remove /sharing/rest from server url during postMessage auth ([04fcdbd](https://github.com/Esri/arcgis-rest-js/commit/04fcdbd5307c79e55610a1bb7e049e3e18f0f0cc))
- **UserSession:** switch "duration" to "expiration" in IOAuth2Options ([#847](https://github.com/Esri/arcgis-rest-js/issues/847)) ([392f5bb](https://github.com/Esri/arcgis-rest-js/commit/392f5bb74b2461e7bd34dd16e784fce415d554ec)), closes [#843](https://github.com/Esri/arcgis-rest-js/issues/843)
- ensure platformSelf sends cookie ([29e33cb](https://github.com/Esri/arcgis-rest-js/commit/29e33cb9b9d0a2e25e412106adb06ff054bd5737))
- export app-tokens ([0171204](https://github.com/Esri/arcgis-rest-js/commit/017120498b32c9322689ad539b216ce8e5c96a3a))
- export validateAppAccess function ([b087de2](https://github.com/Esri/arcgis-rest-js/commit/b087de24ae6d8f41a2bb13c3c25a33943f0db2d8))
- platformSelf to send cookies and append f=json in url ([ed81919](https://github.com/Esri/arcgis-rest-js/commit/ed819194da74075172ff26139f2db4491d79ed12))
- update IPlatformSelfResponse to include expires_in ([dd3557b](https://github.com/Esri/arcgis-rest-js/commit/dd3557b19514a33150db2f15138422bb219681e7))
- **:bug::** ensure fix session.portal url when cred.server contains sharing/rest ([815de49](https://github.com/Esri/arcgis-rest-js/commit/815de49549b35aa9d255de6b05c2beb2d153f37f))
- **:bug::** ensure that the same referer is set in Node.js applications that is passed along in toke ([afaa564](https://github.com/Esri/arcgis-rest-js/commit/afaa5646bffbeec462a733d9b6e021d6499c0be7))
- **:bug::** treat ArcGIS Online orgs as equivalent to arcgis.com when testing a portal ([18c3a7f](https://github.com/Esri/arcgis-rest-js/commit/18c3a7fcc774bad8e2cc9eef15444b62c1ed0dd1)), closes [#233](https://github.com/Esri/arcgis-rest-js/issues/233)
- **:closed_lock_with_key::** expose option to customize expiration of ApplicationSession tokens ([5af14d7](https://github.com/Esri/arcgis-rest-js/commit/5af14d7b10ccee179f7b2da82f4f1478352a8b67)), closes [#314](https://github.com/Esri/arcgis-rest-js/issues/314)
- **arcgis-rest-auth:** enable oAuth from within an IFrame ([e6538d5](https://github.com/Esri/arcgis-rest-js/commit/e6538d5d38c9b2d0f31c6392d257f0d9263170bd)), closes [#711](https://github.com/Esri/arcgis-rest-js/issues/711)
- **arcgis-rest-auth:** ensure that mixed casing of federated server urls does not break the system ([07c92f5](https://github.com/Esri/arcgis-rest-js/commit/07c92f559cc0288fa379d19464f88642c6fe2803))
- **auth:** add additional authentication providers ([85f73b2](https://github.com/Esri/arcgis-rest-js/commit/85f73b22c17a3a3ae72b559a63df2aef8297828c))
- **auth:** allow trailing slash in portal URL ([b76da90](https://github.com/Esri/arcgis-rest-js/commit/b76da902d67d4ac3635ac18eb780e7c68d7617f7))
- **auth:** better regex match for usernames ([d38a7fb](https://github.com/Esri/arcgis-rest-js/commit/d38a7fb0e1bff3c49a135bc10be74893ec60a1e9))
- **auth:** decode username when parsing response from OAuth ([e0c2a44](https://github.com/Esri/arcgis-rest-js/commit/e0c2a44bd5032ce9b45b0f8511e9cc256056872c)), closes [#165](https://github.com/Esri/arcgis-rest-js/issues/165)
- **auth:** improve query and error handling when completing sign in ([4b3905c](https://github.com/Esri/arcgis-rest-js/commit/4b3905ca6517443c9237a44c0fc3249e579db8f5))
- **auth:** use www.arcgis.com consistently ([a7dc28d](https://github.com/Esri/arcgis-rest-js/commit/a7dc28d9fe860f380ed57137bcafe73ab0bb5e9d)), closes [#223](https://github.com/Esri/arcgis-rest-js/issues/223)
- **enterprise:** fetch fresh token manually when u/pw are provided ([299f3c0](https://github.com/Esri/arcgis-rest-js/commit/299f3c0da043b74113310cba9a3e9a0f77afa921)), closes [#161](https://github.com/Esri/arcgis-rest-js/issues/161)
- **lock:** pass through url and options for non-federated requests ([802006c](https://github.com/Esri/arcgis-rest-js/commit/802006cdc68e69851e80c499a236ba4c8fa1cb6f))
- **oauth:** check for window parent correctly in ouath without popup ([a27bb7d](https://github.com/Esri/arcgis-rest-js/commit/a27bb7da5fa5de7ddfbc2d676b707bfa1780ecbf))
- **oAuth:** fix oAuth2 methods in IE 11 and Edge ([462f980](https://github.com/Esri/arcgis-rest-js/commit/462f980082f9eeb8c55b5aa6c5981422ae40105f))
- **OAuth2 options:** added locale and state parameters for browser based OAuth2 ([b05996e](https://github.com/Esri/arcgis-rest-js/commit/b05996e83b1836f9a27337939a9a681d41207504))
- **portal:** fetch tokens for rest admin requests to services federated with ArcGIS Enterprise too ([79dda00](https://github.com/Esri/arcgis-rest-js/commit/79dda000e9cc3d8cf270ab3ace65d70d20d5ac57)), closes [#329](https://github.com/Esri/arcgis-rest-js/issues/329)
- **release:** resolve issues from accidental 1.0.1 release. ([ddd3d6c](https://github.com/Esri/arcgis-rest-js/commit/ddd3d6cab0fb0d789da866cea07244b7a170d9fd))
- **release-automation:** fix issues found in https://github.com/Esri/arcgis-rest-js/pull/80. ([3b42fe9](https://github.com/Esri/arcgis-rest-js/commit/3b42fe9969cc2f6a21428692c72ada8ffffb59a6))
- **release-automation:** fix issues uncovered by 1st release ([a73b76f](https://github.com/Esri/arcgis-rest-js/commit/a73b76f58843d538d8b29b1ae60a72a9f57ac5ec))
- **sharing:** ensure internal sharing metadata calls pass through custom request options ([e70a10d](https://github.com/Esri/arcgis-rest-js/commit/e70a10d5bbd6ac4fecf61f9f635b01cf9c8c5034)), closes [#276](https://github.com/Esri/arcgis-rest-js/issues/276)
- **sharing:** rework group membership checking, fix UserSession.getUser scope issue ([909a37e](https://github.com/Esri/arcgis-rest-js/commit/909a37ec2f928ad223c674ae0d4033e24761ae9a))
- **try:** try an anonymous request before throwing an auth error ([9209035](https://github.com/Esri/arcgis-rest-js/commit/9209035072b54bf68425ee9737e2a15010ac1b33))
- **UserSession:** throw ArcGISAuthError instead of Error when unable to refresh a token ([8854765](https://github.com/Esri/arcgis-rest-js/commit/88547656ce88786e2dcac8e8e0e78045b67e8e16)), closes [#56](https://github.com/Esri/arcgis-rest-js/issues/56)
- **UserSession:** will now update expired tokens on non-federated servers ([af121c1](https://github.com/Esri/arcgis-rest-js/commit/af121c1de1c96027a2ca107ed46a7877b61c5a4f))

### Code Refactoring

- change casing of IOauth2Options to IOAuth2Options ([9ffd227](https://github.com/Esri/arcgis-rest-js/commit/9ffd2277055864d5257cb7a6c9913c70079e7da5))
- deprecate common-types package (in favor of common) ([6ab2e75](https://github.com/Esri/arcgis-rest-js/commit/6ab2e75a3b57ce77391da7f2a16ab57a3e781000))

### Features

- **:snowman::** add basic support for accessing secure non-federated services ([fc2f06b](https://github.com/Esri/arcgis-rest-js/commit/fc2f06b74a40261ae9b6bb959048d353be02153b)), closes [#174](https://github.com/Esri/arcgis-rest-js/issues/174)
- **:unlock::** add support for an OAuth flow that triggers social media login automatically ([2e582e1](https://github.com/Esri/arcgis-rest-js/commit/2e582e12fc3e5bf9688b3ba80da33e4a5a5fa84f)), closes [#239](https://github.com/Esri/arcgis-rest-js/issues/239)
- **all packages:** start shipping an unminified UMD for each package ([52043f5](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5)), closes [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
- **ApplicationSession:** only allow 1 pending request for a new token at a time ([4e6f9e2](https://github.com/Esri/arcgis-rest-js/commit/4e6f9e27d561566449ef2338b078f44d0e3b65b5))
- **arcgis-rest-auth:** add postMessage auth support ([a6b8a17](https://github.com/Esri/arcgis-rest-js/commit/a6b8a17a265339725a8c5dfd90e408f28a035787))
- **arcgis-rest-auth:** add validateAppAccess function and UserSession method ([2478ea5](https://github.com/Esri/arcgis-rest-js/commit/2478ea56d43302d3f7fab6ffd38a9d2c609bb510))
- **arcgis-rest-auth:** reduce postMessageAuth query params ([154515f](https://github.com/Esri/arcgis-rest-js/commit/154515f66a4eedb9ee83dd8528549db55e268871))
- **auth:** add getCredential() method to UserSession for jsapi ([c03430d](https://github.com/Esri/arcgis-rest-js/commit/c03430d4d5b93d983c9cab39117a5623113425e8)), closes [#208](https://github.com/Esri/arcgis-rest-js/issues/208)
- **auth:** add reflexive method to instantiate UserSession from jsapi auth ([ea64da9](https://github.com/Esri/arcgis-rest-js/commit/ea64da92c74c3a9b6671e66872070372db46cd72)), closes [#208](https://github.com/Esri/arcgis-rest-js/issues/208)
- **caring:** methods to un/share items with groups ([8572bb0](https://github.com/Esri/arcgis-rest-js/commit/8572bb0ab0222e4f0eedbe9cfd4ff00c160f0c77))
- **request:** adds option to return the raw fetch response ([6fb7c79](https://github.com/Esri/arcgis-rest-js/commit/6fb7c792f4aab585a06bb1178b41a8687eabc419)), closes [#462](https://github.com/Esri/arcgis-rest-js/issues/462)
- **UserSession:** added optional 'popupWindowFeatures' to 'IOAuth2Options' ([f96a581](https://github.com/Esri/arcgis-rest-js/commit/f96a581033513c9a546998bc37254a46e364f153))
- **UserSession:** multiple requests to getToken for similar URLs now return the same Promise ([751e5f1](https://github.com/Esri/arcgis-rest-js/commit/751e5f19d2e6fac184a0a17cc216c54cc5c1e9f2))
- **UserSession:** rename refreshTokenDuration to refreshTokenTTL ([a6406d4](https://github.com/Esri/arcgis-rest-js/commit/a6406d4d10308b266fd7ddcc6168f32419f206aa))
- **util:** add getUserUrl method to auth package ([d742b34](https://github.com/Esri/arcgis-rest-js/commit/d742b343130a8a0d5baaf9391ac48f5c5c334c6d))

### BREAKING CHANGES

- deprecate common-types package (in favor of common)
- change casing of IOauth2Options to IOAuth2Options

### Dependencies

- **@esri/arcgis-rest-request:** upgraded to 1.0.0-beta.1
