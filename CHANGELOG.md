# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
[1.0.3]: https://github.com/Esri/arcgis-rest-js/compare/v1.0.2...1.0.3 "1.0.3"
[HEAD]: https://github.com/Esri/arcgis-rest-js/compare/1.0.3...HEAD "Unreleased Changes"
