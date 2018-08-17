# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

### [Unreleased][HEAD]

## [1.8.0] - August 17th 2018

### @esri/arcgis-rest-items

* Chores
   * **items**: break out item methods into individual files [`be17cab`](https://github.com/Esri/arcgis-rest-js/commit/be17cab0f5801858e3dc8b7455a0f0cf98e577f5)
* New Features
   * **resources**: new method to add a new resource to an item [`9c63075`](https://github.com/Esri/arcgis-rest-js/commit/9c63075e9f202a13632e34e2a478a9de70b6fafb) [#281](https://github.com/Esri/arcgis-rest-js/issues/281)
* Bug Fixes
   * **search**: ensure searchItems can mixin arbitrary parameters with a searchform [`a26b935`](https://github.com/Esri/arcgis-rest-js/commit/a26b9354a35b11014eda23dacccbf53210606e7e)

### Other Changes

* Chores
   * **publish**: check for npm login before allowing publish [`7b13a1a`](https://github.com/Esri/arcgis-rest-js/commit/7b13a1a2b5d4153e56bec347cf2a903a826251a7)
   * **doc**: misc doc fixes 🙏gavinr🙏 
   
## [1.7.1] - August 10th 2018

### @esri/arcgis-rest-auth

* Bug Fixes
   * **sharing**: ensure internal sharing metadata calls pass through custom request options [`e70a10d`](https://github.com/Esri/arcgis-rest-js/commit/e70a10d5bbd6ac4fecf61f9f635b01cf9c8c5034) [#276](https://github.com/Esri/arcgis-rest-js/issues/276)

### @esri/arcgis-rest-items

* Tests
   * **items**: test body of addItemData request in browser tests [`2710f4c`](https://github.com/Esri/arcgis-rest-js/commit/2710f4c281f3e04b00b9ad2da73ca4e35f9dfcb3)

### @esri/arcgis-rest-request

* Bug Fixes
   * **encodeFormData**: append file name based on object type instead of key and name properties [`401c6dd`](https://github.com/Esri/arcgis-rest-js/commit/401c6dd205c1e2470783435d0da22338edbcaed4)

### @esri/arcgis-rest-sharing

* Bug Fixes
   * **sharing**: ensure internal sharing metadata calls pass through custom request options [`e70a10d`](https://github.com/Esri/arcgis-rest-js/commit/e70a10d5bbd6ac4fecf61f9f635b01cf9c8c5034) [#276](https://github.com/Esri/arcgis-rest-js/issues/276)

### Other Changes

* Bug Fixes
   * **sharing**: ensure internal sharing metadata calls pass through cus… [`c09548c`](https://github.com/Esri/arcgis-rest-js/commit/c09548c866d11a6c7c693bf948e8f1889b7893a8)

## [1.7.0] - August 7th 2018

* Chores
   * **all**: more legible, terse copyright notices in built packages.

### @esri/arcgis-rest-request

* Bug Fixes
   * avoid `new Header()` when POSTing to ensure that the library is able to utilize custom fetch implementations correctly.

### @esri/arcgis-rest-auth

* Bug Fixes
   * the `getToken()` method of both `UserSession` and `ApplicationSession` now expose a `requestOptions?` parameter so that a custom fetch implementation can be passed through.

### @esri/arcgis-rest-feature-service

* Features
   * new `queryRelated()` method for querying the related records associated with a feature service 🙏mpayson🙏

## [1.6.0] - July 27th 2018

### @esri/arcgis-rest-auth

* Chores
   * **all**: get pkg.versions back in sync [`c7751c8`](https://github.com/Esri/arcgis-rest-js/commit/c7751c866bb500833fcd3506f6de7a60928a35fa)

* Bug Fixes
   * ensure tokens can be generated successfully for hosted feature services.

### @esri/arcgis-rest-common-types

* Chores
   * **groups**: remove duplicate IGroup interface and corrections to IItem interface) [`dd10d72`](https://github.com/Esri/arcgis-rest-js/commit/dd10d722efac1b2b2c70c84ebbd0468854f88e33) [#241](https://github.com/Esri/arcgis-rest-js/issues/241)

### @esri/arcgis-rest-feature-service

* Features
   * new methods for querying, adding, updating and deleting feature service attachments 🙏COV-GIS🙏
   * new feature service attachement demo! 🙏COV-GIS🙏
   * **query features**: add count and extent to IQueryFeaturesResponse [`2ab9f33`](https://github.com/Esri/arcgis-rest-js/commit/2ab9f339f746e79beb06301e2c5e967d8c5135a2)

### @esri/arcgis-rest-groups

* Chores
   * **groups**: remove duplicate IGroup interface (and extend IItem) [`dd10d72`](https://github.com/Esri/arcgis-rest-js/commit/dd10d722efac1b2b2c70c84ebbd0468854f88e33) [#241](https://github.com/Esri/arcgis-rest-js/issues/241)

### @esri/arcgis-rest-items

* Features
   * **data**: added support for fetching and uploading binary data associated with items 🙏MikeTschudi🙏
* Bug Fixes
   * **crud**: enforce more AGOL rules in item crud operations [`3f365d9`](https://github.com/Esri/arcgis-rest-js/commit/3f365d9b0847a7cacd46d7b4c1a34b5dda235f7b) [#246](https://github.com/Esri/arcgis-rest-js/issues/246)
* Chores
   * more consistent `owner` checks across item methods

### @esri/arcgis-rest-request

* Chores
   * **all**: get pkg.versions back in sync [`c7751c8`](https://github.com/Esri/arcgis-rest-js/commit/c7751c866bb500833fcd3506f6de7a60928a35fa)

### Other Changes

* Documentation
   * **api**: add toggle component for side nav on API page. [`1432c22`](https://github.com/Esri/arcgis-rest-js/commit/1432c228c8c3816e3a41f605eb276bceb8920075)
   * **api**: fix api nav toggle url path check so it works in production [`90db4a0`](https://github.com/Esri/arcgis-rest-js/commit/90db4a00700c00e3048d887176e8ecd32a66909c)

## [1.5.1] - July 12th 2018

### @esri/arcgis-rest-users

* Bug Fixes
   * **users**: users defaults to https://www.arcgis.com instead of http:// [`7e3d9f6`](https://github.com/Esri/arcgis-rest-js/commit/7e3d9f621ced27e3a64778ebbebff40fcc93d994)

### Other Changes

* Bug Fixes
   * **users**: users defaults to https://www.arcgis.com instead of http:// [`d92e053`](https://github.com/Esri/arcgis-rest-js/commit/d92e05364e78ae21c3bb4adbeb725ba89503d966)

## [1.5.0] - July 10th 2018

### @esri/arcgis-rest-auth

* New Features
  * **auth** add support for an OAuth flow that triggers social media login automatically [`2e582e1`](https://github.com/Esri/arcgis-rest-js/commit/2e582e12fc3e5bf9688b3ba80da33e4a5a5fa84f)

* Bug Fixes
   * **enterprise**: fetch fresh token manually when u/pw are provided [`299f3c0`](https://github.com/Esri/arcgis-rest-js/commit/299f3c0da043b74113310cba9a3e9a0f77afa921) [#161](https://github.com/Esri/arcgis-rest-js/issues/161)

### Other Changes

* Bug Fixes
   * **enterprise**: ensure a brand new token can be generated for servers federated with ArcGIS Enterprise [`ddd3d57`](https://github.com/Esri/arcgis-rest-js/commit/ddd3d57bb8a98f79c0fb0de6507d5e9483ab91ec)

## [1.4.2] - July 8th 2018

* Bug Fixes:
   * removed corrupt artifacts shipped with previous release
   * **crud**: ensure add/update/deleteFeatures dont pass extraneous parameters [`8566860`](https://github.com/Esri/arcgis-rest-js/commit/8566860554beb32e87c4b9b28b40138b7ac70b80) [#223](https://github.com/Esri/arcgis-rest-js/pull/238/)
   * **auth** fixed typo in peerDependency name [`d0d89b8`](https://github.com/Esri/arcgis-rest-js/commit/d0d89b875e4887c327f4501aaa47ac9f339a6c6b) 🙏richardhinkamp🙏 [#237](https://github.com/Esri/arcgis-rest-js/pull/237/)

## [1.4.1] - June 20th 2018

### @esri/arcgis-rest-auth

* New Features
   * **auth**: add toCredential() method to UserSession to pass to jsapi [`c03430d`](https://github.com/Esri/arcgis-rest-js/commit/c03430d4d5b93d983c9cab39117a5623113425e8) [#208](https://github.com/Esri/arcgis-rest-js/issues/208)
   * **auth**: add fromCredential() to instantiate UserSession _from_ jsapi auth [`ea64da9`](https://github.com/Esri/arcgis-rest-js/commit/ea64da92c74c3a9b6671e66872070372db46cd72) [#208](https://github.com/Esri/arcgis-rest-js/issues/208)
* Bug Fixes
   * **auth**: use www.arcgis.com consistently [`a7dc28d`](https://github.com/Esri/arcgis-rest-js/commit/a7dc28d9fe860f380ed57137bcafe73ab0bb5e9d) [#223](https://github.com/Esri/arcgis-rest-js/issues/223)

### @esri/arcgis-rest-feature-service

* Misc.
   * **feature-service**: refactor feature service signatures to stop leaning on params directly [`410a511`](https://github.com/Esri/arcgis-rest-js/commit/410a511b2992f5d3daffeef7937a8b270e119bf9)

### @esri/arcgis-rest-geocoder

* Misc.
   * **reorganizing**: break up geocoding package into multiple files [`216f23c`](https://github.com/Esri/arcgis-rest-js/commit/216f23cbc21803c22db6a737b48f97507fe6bc0b) [#216](https://github.com/Esri/arcgis-rest-js/issues/216)

### Other Changes

* Documentation
   * **demos**: jsapi integration demo shows more typical scenario [`0878793`](https://github.com/Esri/arcgis-rest-js/commit/0878793cf3d2cdd05f7cdc39ede9802a415f8f85)
* Misc.
   * **feature-service**: update signatures [`c0a881b`](https://github.com/Esri/arcgis-rest-js/commit/c0a881bd028eb189ca27fa666ae1089663a563c1)

## [1.4.0] - June 6th 2018

### @esri/arcgis-rest-auth

* New Features
   * **caring**: methods to un/share items with groups [`8572bb0`](https://github.com/Esri/arcgis-rest-js/commit/8572bb0ab0222e4f0eedbe9cfd4ff00c160f0c77)

### @esri/arcgis-rest-demo-express

* Chores
   * **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-demo-vanilla

* Chores
   * **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-demo-vue-with-popup

* Chores
   * **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-geocoder-vanilla

* Chores
   * **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-sharing

* New Features
   * **caring**: new sharing package with method to set access on items [`a212d59`](https://github.com/Esri/arcgis-rest-js/commit/a212d59abf820f2e719aaaedb85dd3f3708dc793) [#43](https://github.com/Esri/arcgis-rest-js/issues/43)
   * **caring**: methods to un/share items with groups [`8572bb0`](https://github.com/Esri/arcgis-rest-js/commit/8572bb0ab0222e4f0eedbe9cfd4ff00c160f0c77)

### Other Changes

* Chores
   * **tooling**: bump commitizen to allow empty commits [`b4f254c`](https://github.com/Esri/arcgis-rest-js/commit/b4f254cd6eaa8e456ca23524f746eeb925ec534c)

### batch-geocoder

* Chores
   * **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### feature-service-browser

* Chores
   * **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### node-cli

* Chores
   * **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

## [1.3.0] - May 23rd 2018

### @esri/arcgis-rest-items

* Bug Fixes
  * Better handling of missing tags [`c7ba459`](https://github.com/Esri/arcgis-rest-js/commit/c7ba459a1e455132e3d494d6679c835eebdcef90) 🙏alukach🙏

### @esri/arcgis-rest-common-types

* New Features
  * Loads of new Webmap typings! [`e52f115`](https://github.com/Esri/arcgis-rest-js/commit/e52f11506f087d29ad59e302e95e055d73cb1c9c) 🙏JeffJacobson🙏

### @esri/arcgis-rest-feature-service

* Documentation
   * **feature-service**: add missing `@params` [`b0d96f1`](https://github.com/Esri/arcgis-rest-js/commit/b0d96f118211edbabac08669260235b71ee96fec)

### @esri/arcgis-rest-request

* Chores
   * **404**: new bit.ly link in err message [`4976a2c`](https://github.com/Esri/arcgis-rest-js/commit/4976a2c83863d98ec40b3991e2ab14263529ac8e)

### Other Changes

* Misc.
   * **arcgis-rest-common-types**: simplified build [`11ae59c`](https://github.com/Esri/arcgis-rest-js/commit/11ae59c1a78835fea91430da9ef860c60225ee7e)
* Chores
   * **404**: new bit.ly link in err message [`e406915`](https://github.com/Esri/arcgis-rest-js/commit/e4069159abc7c58727ef811d32ec825ce7349306)
* Documentation
   * **feature-service**: add missing `@params` [`80faae8`](https://github.com/Esri/arcgis-rest-js/commit/80faae8b681d338823db70a70da61e0e46fa87fa)
* New Features
   * **common-types**: Added webmap interfaces and types [`e52f115`](https://github.com/Esri/arcgis-rest-js/commit/e52f11506f087d29ad59e302e95e055d73cb1c9c)

## [1.2.1] - May 15th 2018

### Other Changes

* Bug Fixes
   * **umd**: strip outdated umd files from npm packages [`2e1764d`](https://github.com/Esri/arcgis-rest-js/commit/2e1764ddfc4c43956d94d440412464d10cd4aea5) [#198](https://github.com/Esri/arcgis-rest-js/issues/198)

## [1.2.0] - May 14th 2018

### @esri/arcgis-rest-auth

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
* Bug Fixes
   * **oAuth**: fix oAuth2 methods in IE 11 and Edge [`462f980`](https://github.com/Esri/arcgis-rest-js/commit/462f980082f9eeb8c55b5aa6c5981422ae40105f)

### @esri/arcgis-rest-common-types

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
* Bug Fixes
   * **IItem**: make all IItem properties optional [`8df9278`](https://github.com/Esri/arcgis-rest-js/commit/8df9278a5c59f6e85384dd106f0d379c847f72c1) [#171](https://github.com/Esri/arcgis-rest-js/issues/171)

### @esri/arcgis-rest-feature-service

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
* Documentation
   * **snippets**: add CRUD feature service snippets and fix geocoder ones [`7143f06`](https://github.com/Esri/arcgis-rest-js/commit/7143f0625c6c3c0cc21a1451ffa76a35ddba60f1) [#190](https://github.com/Esri/arcgis-rest-js/issues/190)
* New Features
   * **feature-service**: add feature service CRUD methods [`5cb8fbc`](https://github.com/Esri/arcgis-rest-js/commit/5cb8fbcb0ff4bbb314b9926511c4502d0f4737b0) [#176](https://github.com/Esri/arcgis-rest-js/issues/176)

### @esri/arcgis-rest-geocoder

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
* Documentation
   * **snippets**: add CRUD feature service snippets and fix geocoder ones [`7143f06`](https://github.com/Esri/arcgis-rest-js/commit/7143f0625c6c3c0cc21a1451ffa76a35ddba60f1) [#190](https://github.com/Esri/arcgis-rest-js/issues/190)
* Bug Fixes
   * **geocode**: max sure user supplied request options are all passed through [`3ffa710`](https://github.com/Esri/arcgis-rest-js/commit/3ffa7107bcf4d6ee4cf735bb0a14eac638e93a6c)

### @esri/arcgis-rest-groups

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)

### @esri/arcgis-rest-items

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
* Bug Fixes
   * **createItem**: owner `item.owner` authentication.username [`76680a1`](https://github.com/Esri/arcgis-rest-js/commit/76680a1834332a196bf4b93a05caf5020156fe0f)
   * **itemSearch**: max sure user supplied request options are all passed through [`afb9e38`](https://github.com/Esri/arcgis-rest-js/commit/afb9e38e7cf83571a5d998b3eb97678c2e730524) [#183](https://github.com/Esri/arcgis-rest-js/issues/183)

### @esri/arcgis-rest-request

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
* Bug Fixes
   * **fetch**: set credentials: same-origin in fetch options to support sending IWA cookies [`a4d0115`](https://github.com/Esri/arcgis-rest-js/commit/a4d0115522c1d2a3e44e15320c84745ad58389dc)

### @esri/arcgis-rest-users

* Chores
   * **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)

### Other Changes

* Chores
   * **copyright**: remove duplicate copyright statements from minified files [`13b5db5`](https://github.com/Esri/arcgis-rest-js/commit/13b5db52d96f62787aae0b3a9c9558864831f671)
* Documentation
   * **snippets**: add CRUD feature service snippets and fix geocoder ones [`26da42e`](https://github.com/Esri/arcgis-rest-js/commit/26da42e25fd55a2dc6c4a380cc6257e29e6a7d3f)
* Bug Fixes
   * **oauth-demo**: remove ES2015 buts from oAuth Demo for IE 11 [`22ec948`](https://github.com/Esri/arcgis-rest-js/commit/22ec94889d5867c07babaf2c85197f39c0ae46f1)
   * **IItem**: make id and owner the only required properties of IItem [`9c508f2`](https://github.com/Esri/arcgis-rest-js/commit/9c508f25a2404f0cbea8d22da98653a875a49901)
   * **fetch**: set credentials: same-origin in fetch options  [`3ae7159`](https://github.com/Esri/arcgis-rest-js/commit/3ae715939fd3245a8dc0f693e82a7df16fe099a1)

### doc improvements

* Bug Fixes
   * **createItem**: owner item.owner authentication.username [`76680a1`](https://github.com/Esri/arcgis-rest-js/commit/76680a1834332a196bf4b93a05caf5020156fe0f)

## [1.1.2] - May 2nd 2018

### @esri/arcgis-rest-auth

* Chores
   * **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
   * **security**: bump devDependencies to resolve security vulnerability [`16fd1a7`](https://github.com/Esri/arcgis-rest-js/commit/16fd1a7915ebd2dbed1c25ec5ce99875505106cc)
* Documentation
   * **LICENSE**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
* Bug Fixes
   * **auth**: allow trailing slash in portal URL [`b76da90`](https://github.com/Esri/arcgis-rest-js/commit/b76da902d67d4ac3635ac18eb780e7c68d7617f7)
   * **auth**: decode username when parsing response from OAuth [`e0c2a44`](https://github.com/Esri/arcgis-rest-js/commit/e0c2a44bd5032ce9b45b0f8511e9cc256056872c) [#165](https://github.com/Esri/arcgis-rest-js/issues/165)
   * **OAuth2 options**: added locale and state parameters for browser based OAuth2 [`b05996e`](https://github.com/Esri/arcgis-rest-js/commit/b05996e83b1836f9a27337939a9a681d41207504)

### @esri/arcgis-rest-common-types

* Chores
   * **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
* Documentation
   * **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
* New Features
   * **new users package**: added rest-users with a single method [`a24ed0b`](https://github.com/Esri/arcgis-rest-js/commit/a24ed0b78d5d044089aed104e5ba38c25fff69a6) [#159](https://github.com/Esri/arcgis-rest-js/issues/159)

### @esri/arcgis-rest-demo-vue-with-popup

* Chores
   * **security**: bump devDependencies to resolve security vulnerability [`16fd1a7`](https://github.com/Esri/arcgis-rest-js/commit/16fd1a7915ebd2dbed1c25ec5ce99875505106cc)

### @esri/arcgis-rest-feature-service

* Chores
   * **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
* Documentation
   * **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-geocoder

* Chores
   * **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
* Documentation
   * **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-groups

* Chores
   * **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
* Documentation
   * **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-items

* Chores
   * **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
* Documentation
   * **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-request

* Chores
   * **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
* Documentation
   * **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
* Bug Fixes
   * **getPortalUrl**: make getPortalUrl use portal in request options if passed in [`6103101`](https://github.com/Esri/arcgis-rest-js/commit/61031012d249fcaa9d86b5c68c9cbe7489b7a3b5) [#180](https://github.com/Esri/arcgis-rest-js/issues/180)

### @esri/arcgis-rest-users

* Documentation
   * **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
* New Features
   * **new users package**: added rest-users with a single method [`a24ed0b`](https://github.com/Esri/arcgis-rest-js/commit/a24ed0b78d5d044089aed104e5ba38c25fff69a6) [#159](https://github.com/Esri/arcgis-rest-js/issues/159)

### Other Changes

* Chores
   * **batch-geocoder**: make sure sample data is include in repo [`7df7b54`](https://github.com/Esri/arcgis-rest-js/commit/7df7b548c6564dc2b77b9d228af83649b14a0d80)
   * **all READMEs**: add links to API reference sections [`ab546e0`](https://github.com/Esri/arcgis-rest-js/commit/ab546e0e9d0276539ea5a7f24cace9f97bc9dac8)
   * **CONTRIBUTING**: add info about commitizen (#167) [`9477de1`](https://github.com/Esri/arcgis-rest-js/commit/9477de1e7eb7e921ab30b6e618b4bcddc641d06d) [#147](https://github.com/Esri/arcgis-rest-js/issues/147) [#167](https://github.com/Esri/arcgis-rest-js/issues/167)
* Documentation
   * **changelog**: fix comparison links and use todays date for each release [`27c9f33`](https://github.com/Esri/arcgis-rest-js/commit/27c9f337a9511f3b6fd39f236a04eacedb76eff6) [#149](https://github.com/Esri/arcgis-rest-js/issues/149)
   * **changelog**: fix comparison links and use todays date for each re… [`29e879d`](https://github.com/Esri/arcgis-rest-js/commit/29e879d27ec322680457b06f0c5155cd6b48e93e)
   * **LICENSE**: fix license links in package READMEs [`00d7e8c`](https://github.com/Esri/arcgis-rest-js/commit/00d7e8cf381edc669c4b5fe92e5b21961479dc9e)
* New Features
   * **new users package**: add rest-users with a single method [`29b7af0`](https://github.com/Esri/arcgis-rest-js/commit/29b7af087c366fe377345d015ff8c3910f969c2c)
* Bug Fixes
   * **auth**: decode username when parsing response from OAuth [`fd9005f`](https://github.com/Esri/arcgis-rest-js/commit/fd9005fef74c33c684273fd283aa6bd9990e8630)
   * **OAuth2 options**: add locale and state parameters for browser based OAuth2 [`6234f0c`](https://github.com/Esri/arcgis-rest-js/commit/6234f0c9cc40a73a0e6e05080abef48bc8b15b2b)

### batch-geocoder

* Chores
   * **batch-geocoder**: make sure sample data is include in repo [`9b4d6b5`](https://github.com/Esri/arcgis-rest-js/commit/9b4d6b5420c9e3be846e93661f433e76a0ed6882)

### use clientId for state by default

* Bug Fixes
   * **OAuth2 options**: added locale and state parameters for browser based OAuth2 [`b05996e`](https://github.com/Esri/arcgis-rest-js/commit/b05996e83b1836f9a27337939a9a681d41207504)

## [1.1.1] - March 5th 2018

### @esri/arcgis-rest-common-types

* Bug Fixes
   * **common-types**: ensure typings are distributed in common-types npm package [`bec3fbf`](https://github.com/Esri/arcgis-rest-js/commit/bec3fbfeac304a12be419c4bf560ace800f99c56) [#151](https://github.com/Esri/arcgis-rest-js/issues/151)

### @esri/arcgis-rest-demo-vanilla

* Bug Fixes
   * **common-types**: ensure typings are distributed in common-types npm package [`bec3fbf`](https://github.com/Esri/arcgis-rest-js/commit/bec3fbfeac304a12be419c4bf560ace800f99c56) [#151](https://github.com/Esri/arcgis-rest-js/issues/151)

### @esri/arcgis-rest-request

* Bug Fixes
   * **request**: ensure request is passed through as a request parameter [`77ad553`](https://github.com/Esri/arcgis-rest-js/commit/77ad5533b273c60cb4c6078ecf8fc05249214c19) [#142](https://github.com/Esri/arcgis-rest-js/issues/142)

### Other Changes

* Bug Fixes
   * **common-types**: ensure typings are distributed in common-types npm… [`3dfed70`](https://github.com/Esri/arcgis-rest-js/commit/3dfed705ea935ff06aec598f0a56b767febace6c)
   * **request**: ensure request is passed through as a request parameter [`43936f7`](https://github.com/Esri/arcgis-rest-js/commit/43936f7d9609c5e87224873ddcfaf0efff693492)

## [1.1.0] - March 3rd 2018

### @esri/arcgis-rest-auth

* Chores
   * **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
* New Features
   * **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
* Bug Fixes
   * **auth**: better regex match for usernames [`d38a7fb`](https://github.com/Esri/arcgis-rest-js/commit/d38a7fb0e1bff3c49a135bc10be74893ec60a1e9)
   * **build**: set other @esri/arcgis-rest-js-* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-common-types

* Chores
   * **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
* New Features
   * **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
   * **lots more common-types**: adding a lot more common data types [`73ce0b8`](https://github.com/Esri/arcgis-rest-js/commit/73ce0b8ff4780fa925814f9bf279c74a513fc0ad)
* Bug Fixes
   * **build**: set other @esri/arcgis-rest-js-* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-feature-service

* Chores
   * **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
* New Features
   * **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
   * **feature service**: New arcgis-rest-feature-serivce package w/ `getFeature()` to get a feature by id [`1d0e57e`](https://github.com/Esri/arcgis-rest-js/pull/115/commits/1d0e57eadf283ec37887f097201029196f2ba348)
   * **feature service**: add queryFeatures() to send query requests to feature services [#126](https://github.com/Esri/arcgis-rest-js/pull/126)

* Bug Fixes
   * **build**: set other @esri/arcgis-rest-js-* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-geocoder

* Chores
   * **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
* New Features
   * **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
   * **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
* Bug Fixes
   * **build**: set other @esri/arcgis-rest-js-* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)
* Misc.
   * **geocoder**: rename IGeocodeServiceInfoResponse to IGetGeocodeServiceResponse [`2586de1`](https://github.com/Esri/arcgis-rest-js/commit/2586de1cf6d4ef4b3f31fe5acb9b5ab2f949e9b8)
   * **geocoder**: use a more descriptive method to fetch metadata [`c774937`](https://github.com/Esri/arcgis-rest-js/commit/c774937ac6a9dc21066a2a46d01b99240e551b76) [#122](https://github.com/Esri/arcgis-rest-js/issues/122)

### @esri/arcgis-rest-groups

* Chores
   * **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
* New Features
   * **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
   * **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
* Bug Fixes
   * **build**: set other @esri/arcgis-rest-js-* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-items

* Chores
   * **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
* New Features
   * **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
   * **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
* Bug Fixes
   * **build**: set other @esri/arcgis-rest-js-* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-request

* Chores
   * **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
* New Features
   * **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
   * **request**: let consumers specify GET w/ max URL length; if exceeded, use POST [`6b9f658`](https://github.com/Esri/arcgis-rest-js/pull/127/commits/6b9f6584c73b3d7db7734f48e93355de72b7c9d8)
* Bug Fixes
   * **request**: ensure falsy request parameters are passed through [`3c69a10`](https://github.com/Esri/arcgis-rest-js/commit/3c69a103c04c089a876b03cc88179caa5fb4e705) [#142](https://github.com/Esri/arcgis-rest-js/issues/142)
   * **request**: HTTP errors throw ArcGISRestError before parsing response [`c86b07d`](https://github.com/Esri/arcgis-rest-js/pull/131/commits/c86b07d6fb4b89f6469ee052f35ee23a2e3d4915)
   * **build**: set other @esri/arcgis-rest-js-* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)
* Misc.
   * **geocoder**: use a more descriptive method to fetch metadata [`c774937`](https://github.com/Esri/arcgis-rest-js/commit/c774937ac6a9dc21066a2a46d01b99240e551b76) [#122](https://github.com/Esri/arcgis-rest-js/issues/122)

### Other Changes

* Chores
   * **rollup**: bump to the latest version of rollup [`f4411c3`](https://github.com/Esri/arcgis-rest-js/commit/f4411c33c62adb83e46253b7b029c13155009df8)
   * **rollup**: bump to the latest version of rollup [`b22a262`](https://github.com/Esri/arcgis-rest-js/commit/b22a2626b68e0a805ac013adb8b776f9fd72f8a1) [#136](https://github.com/Esri/arcgis-rest-js/issues/136)
   * **npm packages**: remove test files and tsconfig.json from npm tar… [`232b863`](https://github.com/Esri/arcgis-rest-js/commit/232b863aae45ea3ad1f85b8c027ade8976e090e9)
   * **changelog**: prevent changelog.js from looking beyond newline for closed issues [`a2b6996`](https://github.com/Esri/arcgis-rest-js/commit/a2b6996dfc9545808aacf3302250e3c8a3cc3038)
   * **changelog**: prevent changelog.js from looking beyond newline for closed issues [`8b21d67`](https://github.com/Esri/arcgis-rest-js/commit/8b21d6717071256418f5b633e17283335a88c543)
* Documentation
   * **getting started**: rearranged getting started doc and fixed a cou… [`361210c`](https://github.com/Esri/arcgis-rest-js/commit/361210c20573d25d1eb6227195c81cd1750a26b8)
   * **getting started**: rearranged getting started doc and fixed a couple typos [`3d5b371`](https://github.com/Esri/arcgis-rest-js/commit/3d5b371f54fa6fef9cc07aba6d19367e4777b0da)
* Bug Fixes
   * **auth**: better regex match for usernames [`04ec689`](https://github.com/Esri/arcgis-rest-js/commit/04ec689cc5a0294d24c85373cb708e7d40534a4d)
   * **request**: ensure falsy request parameters like zero are passed through [`d657b57`](https://github.com/Esri/arcgis-rest-js/commit/d657b57fdf4540ac61cfa0dac5f793fe9dc1fbe6)
* Misc.
   * **geocoder**: use a more descriptive method to fetch metadata [`4b1544f`](https://github.com/Esri/arcgis-rest-js/commit/4b1544f8b788573137d3519718ab1869eefd17a2)

### batch-geocoder

* Breaking Changes
   * **lots more common-types**: adding a lot more common data types [`73ce0b8`](https://github.com/Esri/arcgis-rest-js/commit/73ce0b8ff4780fa925814f9bf279c74a513fc0ad)

## [1.0.3] - December 21st 2017

### @esri/arcgis-rest-auth

* Documentation
   * **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
* Bug Fixes
   * **UserSession**: throw ArcGISAuthError instead of Error when unable to refresh a token [`8854765`](https://github.com/Esri/arcgis-rest-js/commit/88547656ce88786e2dcac8e8e0e78045b67e8e16) [#56](https://github.com/Esri/arcgis-rest-js/issues/56)
   * **oauth**: check for window parent correctly in ouath without popup [`a27bb7d`](https://github.com/Esri/arcgis-rest-js/commit/a27bb7da5fa5de7ddfbc2d676b707bfa1780ecbf)
* Misc.
   * **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-common-types

* Documentation
   * **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)

### @esri/arcgis-rest-demo-vanilla

* Documentation
   * **batch geocoder**: add new demo to batch geocode addresses from csv in node [`152c9d8`](https://github.com/Esri/arcgis-rest-js/commit/152c9d88663555d3b05a38f374114bf8ddd18394) [#97](https://github.com/Esri/arcgis-rest-js/issues/97)

### @esri/arcgis-rest-geocoder

* Documentation
   * **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
* Misc.
   * **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-geocoder-vanilla

* Documentation
   * **batch geocoder**: add new demo to batch geocode addresses from csv in node [`152c9d8`](https://github.com/Esri/arcgis-rest-js/commit/152c9d88663555d3b05a38f374114bf8ddd18394) [#97](https://github.com/Esri/arcgis-rest-js/issues/97)

### @esri/arcgis-rest-groups

* Documentation
   * **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
* Misc.
   * **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-items

* Documentation
   * **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
* Bug Fixes
   * **items**: dont override user supplied parameters when updating items [`eaa1656`](https://github.com/Esri/arcgis-rest-js/commit/eaa1656fc0164098e45897ccd1bc9b21a865d2df) [#117](https://github.com/Esri/arcgis-rest-js/issues/117)
   * **params**: flip param values in updateItemResource so they are passed correctly [`5093e39`](https://github.com/Esri/arcgis-rest-js/commit/5093e390f5f60f5ca39901c361c4c993f1355d73) [#118](https://github.com/Esri/arcgis-rest-js/issues/118)
* Misc.
   * **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-request

* Documentation
   * **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
* Bug Fixes
   * **request**: allow options.fetch without global fetch [`99cf01c`](https://github.com/Esri/arcgis-rest-js/commit/99cf01c391cffc4ba73f39119db05564962abd74) [#108](https://github.com/Esri/arcgis-rest-js/issues/108)
* Misc.
   * **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### Other Changes

* Chores
   * **commit-script**: remove \`git add all\` from \`npm run c\` [`8d7f7ef`](https://github.com/Esri/arcgis-rest-js/commit/8d7f7ef4f4705738eddc5de74d92cc4f60462037)
   * **prettier**: ignore package.json and package-lock.json [`57d234e`](https://github.com/Esri/arcgis-rest-js/commit/57d234ee0bb20f336803cb1af7df026043ad81ed)
* Documentation
   * **links**: fix remaining 404s in docs [`ae59cd9`](https://github.com/Esri/arcgis-rest-js/commit/ae59cd9a3b7ac4c5895a638740708b76a9c87a50)
   * **links**: fix remaining 404s in docs [`3c9a0f0`](https://github.com/Esri/arcgis-rest-js/commit/3c9a0f074215d6f81f03a470c19ef3cff29ee62b) [#92](https://github.com/Esri/arcgis-rest-js/issues/92)
   * **api-ref**: remove function names from types that are functions [`65ca31b`](https://github.com/Esri/arcgis-rest-js/commit/65ca31be92648ae5b26437c40d50543642dcb757)
   * **api-ref**: add support for type children and index signatures as type values [`f88c259`](https://github.com/Esri/arcgis-rest-js/commit/f88c2598a6b786838a8d8b27ac7b58d229f3dbc8)
   * **api-ref**: support rendering array types [`264a123`](https://github.com/Esri/arcgis-rest-js/commit/264a12306c5f79970bac1adf3f52ddf18db1a83c)
   * **api-ref**: display tuples properly, lookup type references by name [`d3729fe`](https://github.com/Esri/arcgis-rest-js/commit/d3729fe35d9f9636a96a46c5a57720d7702c680c)
   * **fix dead links**: fixed broken links within declaration page content [`4fac8bc`](https://github.com/Esri/arcgis-rest-js/commit/4fac8bc1f3944176bd1094d87ab7f6b415c5857f)
   * **get-started**: improve getting started guides [`14f13cb`](https://github.com/Esri/arcgis-rest-js/commit/14f13cb0a4cc47d2e543aaaf283c0ddae1d0e3d6)
   * **documentation-site**: fix docs:deploy script, build and deploy docs after publish [`141ea9b`](https://github.com/Esri/arcgis-rest-js/commit/141ea9b64f19ae1456e030b9d2a852533bed972f)
   * **cleanup**: clear build folder before running docs:build or docs:serve [`fa692bc`](https://github.com/Esri/arcgis-rest-js/commit/fa692bc2495e48004efa0188e55a098a8eda1d18)
   * **refactor**: setup docs to run locally and on esri.github.io/arcgis-rest-js/ [`b4f0d94`](https://github.com/Esri/arcgis-rest-js/commit/b4f0d943acb17c41b3f8f4a4da7511543d1e2aa1)
   * **helpers**: add helpers to generate CDN links and NPM install commands [`c5599ec`](https://github.com/Esri/arcgis-rest-js/commit/c5599ec8cdafe123ec1ad0af4caa42169c9c0552)
* Bug Fixes
   * **oauth**: check for window parent correctly in oauth without popup [`94edc2a`](https://github.com/Esri/arcgis-rest-js/commit/94edc2a1d3110d448fd7abe8367812deccbc7647)
* Misc.
   * **package.json scripts**: dont stage everything when npm run c is called [`a21e98e`](https://github.com/Esri/arcgis-rest-js/commit/a21e98e27ecd7884d579006bb65f0e95370031a2)

### batch-geocoder

* Documentation
   * **batch geocoder**: add new demo to batch geocode addresses from csv in node [`152c9d8`](https://github.com/Esri/arcgis-rest-js/commit/152c9d88663555d3b05a38f374114bf8ddd18394) [#97](https://github.com/Esri/arcgis-rest-js/issues/97)

### node-cli

* Documentation
   * **ago node-cli**: add node-cli demo to search ago [`50c879c`](https://github.com/Esri/arcgis-rest-js/commit/50c879c3c66e49d7d82aa167e9ebe7fb7f4373c8)

## [1.0.2] - December 21st 2017

### Other Changes

* Documentation
   * **cleanup**: clear build folder before running docs:build or docs:serve [`fa692bc`](https://github.com/Esri/arcgis-rest-js/commit/fa692bc2495e48004efa0188e55a098a8eda1d18)
   * **refactor**: setup docs to run locally and on esri.github.io/arcgis-rest-js/ [`b4f0d94`](https://github.com/Esri/arcgis-rest-js/commit/b4f0d943acb17c41b3f8f4a4da7511543d1e2aa1)
* Bug Fixes
   * **release-automation**: run git fetch --all in release:prepare to make sure all changes are fetch f [`bb7d9e8`](https://github.com/Esri/arcgis-rest-js/commit/bb7d9e8022faab14b5e9e24cf95c7374013335b5)
   * **release**: resolve issues from accidental 1.0.1 release. [`ddd3d6c`](https://github.com/Esri/arcgis-rest-js/commit/ddd3d6cab0fb0d789da866cea07244b7a170d9fd)
   * **release-automation**: fix release automation to prep for a 1.0.2 relase [`9dfd957`](https://github.com/Esri/arcgis-rest-js/commit/9dfd9570dd3fb9cf532b84a59a0a007082145574)
   * **release-automation**: checkout a temporary branch for release to not polute the main branch [`75a9dec`](https://github.com/Esri/arcgis-rest-js/commit/75a9decff5f9cca3b1b21a3af16e29701af3b9a2)
   * **release-automation**: fix issues uncovered by 1st release [`e6329f5`](https://github.com/Esri/arcgis-rest-js/commit/e6329f587509a9e35df5c8f8bb4cbc287724552c)

## [1.0.1] - December 21st 2017

### Other Changes

* Bug Fixes
   * **release-automation**: fix issues found in https://github.com/Esri/arcgis-rest-js/pull/80. [`3b42fe9`](https://github.com/Esri/arcgis-rest-js/commit/3b42fe9969cc2f6a21428692c72ada8ffffb59a6)
   * **release-automation**: fix issues uncovered by 1st release [`a73b76f`](https://github.com/Esri/arcgis-rest-js/commit/a73b76f58843d538d8b29b1ae60a72a9f57ac5ec)

## [1.0.0] - December 21st 2017

Initial Public Release

[1.0.0]: https://github.com/Esri/arcgis-rest-js/compare/265d6aed1856d3ae1ff81f03ce85aba449b01f21...v1.0.0 "v1.0.0"
[1.0.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.0.0...v1.0.1 "v1.0.1"
[1.0.2]: https://github.com/Esri/arcgis-rest-js/compare/v1.0.1...v1.0.2 "v1.0.2"
[1.0.3]: https://github.com/Esri/arcgis-rest-js/compare/v1.0.2...v1.0.3 "v1.0.3"
[1.1.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.0.3...v1.1.0 "v1.1.0"
[1.1.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.1.0...v1.1.1 "v1.1.1"
[1.1.2]: https://github.com/Esri/arcgis-rest-js/compare/v1.1.1...v1.1.2 "v1.1.2"
[1.2.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.1.2...v1.2.0 "v1.2.0"
[1.2.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.2.0...v1.2.1 "v1.2.1"
[1.3.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.2.1...v1.3.0 "v1.3.0"
[1.4.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.3.0...v1.4.0 "v1.4.0"
[1.4.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.4.0...v1.4.1 "v1.4.1"
[1.4.2]: https://github.com/Esri/arcgis-rest-js/compare/v1.4.1...v1.4.2 "v1.4.2"
[1.5.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.4.2...v1.5.0 "v1.5.0"
[1.5.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.5.0...v1.5.1 "v1.5.1"
[1.6.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.5.1...v1.6.0 "v1.6.0"
[1.7.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.6.0...v1.7.0 "v1.7.0"
[1.7.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.7.0...v1.7.1 "v1.7.1"
[1.8.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.7.1...v1.8.0 "v1.8.0"
[HEAD]: https://github.com/Esri/arcgis-rest-js/compare/v1.8.0...HEAD "Unreleased Changes"
