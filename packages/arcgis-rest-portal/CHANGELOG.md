# @esri/arcgis-rest-portal [4.0.0-beta.2](https://github.com/Esri/arcgis-rest-js/compare/@esri/arcgis-rest-portal@4.0.0-beta.1...@esri/arcgis-rest-portal@4.0.0-beta.2) (2022-03-02)


### Features

* **arcgis-rest-request:** rewrite oauth 2 functions to use PKCE ([e49f88c](https://github.com/Esri/arcgis-rest-js/commit/e49f88c700694aed472733527124c4d0d54e45d6))





### Dependencies

* **@esri/arcgis-rest-request:** upgraded to 4.0.0-beta.2

# @esri/arcgis-rest-portal 1.0.0-beta.1 (2022-02-17)


### Bug Fixes

* switch to eslint, fix minor issues, disable other rules ([ab47412](https://github.com/Esri/arcgis-rest-js/commit/ab474123d3a056dcd52a8898f39f287893626f35))
* **aggs counts should be array:** aggs counts should be array ([72b3bf7](https://github.com/Esri/arcgis-rest-js/commit/72b3bf74a33d16d89b357556a80eb32d5e70b25b))
* **arcgis-rest-portal:** add fetchMock setup for intermittent failing tests ([5384984](https://github.com/Esri/arcgis-rest-js/commit/53849842f8a0c6192faa36f5634c171721a45903))
* **arcgis-rest-portal:** do not do any membership adjustments if the group is the user's favorites g ([6fc8ada](https://github.com/Esri/arcgis-rest-js/commit/6fc8ada666e2ac6388418d3416db13a40c299757))
* **arcgis-rest-portal:** make \`layers\` parameter of \`IExportParameters\` optional ([0b584e6](https://github.com/Esri/arcgis-rest-js/commit/0b584e66396a9559248e597ec44b256f95fc58e7))
* **arcgis-rest-portal:** share as admin uses content/users/:ownername/items/:id/share end-point ([fd1a960](https://github.com/Esri/arcgis-rest-js/commit/fd1a960cab22e3c1810dc4760a007d409b7f59f1))
* **arcgis-rest-portal:** use deleteRelationship not removeRelationship ([890e485](https://github.com/Esri/arcgis-rest-js/commit/890e4859dc45ce1588b5ba3573c881c227267bf9)), closes [#739](https://github.com/Esri/arcgis-rest-js/issues/739)
* **arcgis-rest-portal:** wrong parameters for file upload APIs ([#761](https://github.com/Esri/arcgis-rest-js/issues/761)) ([cbfef7d](https://github.com/Esri/arcgis-rest-js/commit/cbfef7d6bd669d323dab5299966217a956fc5cfb)), closes [#693](https://github.com/Esri/arcgis-rest-js/issues/693) [#694](https://github.com/Esri/arcgis-rest-js/issues/694) [#700](https://github.com/Esri/arcgis-rest-js/issues/700)
* **getItemResources:** allow user to override paging ([97cbec0](https://github.com/Esri/arcgis-rest-js/commit/97cbec0b918e0ec914beb60abdb36d1265ce5645))
* **getItemResources:** do not mutate requestOptions in getItemResources ([cac63e8](https://github.com/Esri/arcgis-rest-js/commit/cac63e8090b81a6fe2258529060bc6f3f0611fb0))
* **portal:** searchGroupUsers will now respect joined and memberType parameters ([79b15b5](https://github.com/Esri/arcgis-rest-js/commit/79b15b5a00ec3efed2193d3d16f61417bfcc933d))
* **portal:** setting item access to public shares correctly ([6a2b115](https://github.com/Esri/arcgis-rest-js/commit/6a2b11593643a1c760052d844e6346c4f7345149))
* **removeItemResource:** support correct parameters ([#835](https://github.com/Esri/arcgis-rest-js/issues/835)) ([96798fe](https://github.com/Esri/arcgis-rest-js/commit/96798fe01a890514eacd268ef8e2f429fda1be4a))
* **search:** add support for untyped, grouped search strings ([39fc213](https://github.com/Esri/arcgis-rest-js/commit/39fc21379a3e78a27636d62cf46d86e23ad666a0)), closes [#544](https://github.com/Esri/arcgis-rest-js/issues/544)
* **search:** allow NOT as a standalone modifier ([36a6bca](https://github.com/Esri/arcgis-rest-js/commit/36a6bca771dd4282af71dcf454828f58047b525b)), closes [#542](https://github.com/Esri/arcgis-rest-js/issues/542)
* **search:** ensure no space is inserted between search fields and terms ([ff90f51](https://github.com/Esri/arcgis-rest-js/commit/ff90f5132b0cfa7bf9f083ee54996dda5412be4e)), closes [#545](https://github.com/Esri/arcgis-rest-js/issues/545)
* **search:** sortOrder is a valid search param, searchDir is not ([9caeafd](https://github.com/Esri/arcgis-rest-js/commit/9caeafdea4568252b792606dcd485486c4e1f5c8)), closes [#540](https://github.com/Esri/arcgis-rest-js/issues/540)
* **searchGroupUsers func:** searchOptions is now an optional parameter ([d54bddb](https://github.com/Esri/arcgis-rest-js/commit/d54bddb69f003109aac7a3b27be420b465e4f59f)), closes [#615](https://github.com/Esri/arcgis-rest-js/issues/615)
* **sharing:** correct the item sharing logic to reflect what the api actually allows ([48b67e5](https://github.com/Esri/arcgis-rest-js/commit/48b67e542ed41dda798ebfd51321d51729af2b5b))
* **sharing:** only item owner, group owner or group admin can unshare ([d264137](https://github.com/Esri/arcgis-rest-js/commit/d264137cbc51955320c48bad0bd868116832de79))
* **updateItemResources:** support item resource prefix ([98be7a7](https://github.com/Esri/arcgis-rest-js/commit/98be7a74b8362cb20170c3f62d4a61c842a1f8d5)), closes [#824](https://github.com/Esri/arcgis-rest-js/issues/824)
* ensure JSON and binary data are both handled consistently ([9f85087](https://github.com/Esri/arcgis-rest-js/commit/9f8508720cf17e94d26a9516a02e761931408043))


### Code Refactoring

* **portal interfaces:** renames portal request/response interfaces to match their functions ([faa5b3d](https://github.com/Esri/arcgis-rest-js/commit/faa5b3dd5b51800db4931735f05a367c8fcd42e2))
* replace items, groups, sharing and user packages with single portal package ([64a3fd9](https://github.com/Esri/arcgis-rest-js/commit/64a3fd9a8a6824d388acb773ca0ffe8900e476f8))


### Features

* **search:** allows use of the newly added but undocumented searchUserAccess and searchUserName par ([279ef9e](https://github.com/Esri/arcgis-rest-js/commit/279ef9e2dbee9ada0bb2d319aec027c85886cd0e))
* service name and service info fns ([bb5f90d](https://github.com/Esri/arcgis-rest-js/commit/bb5f90d3fd0cbe594a687fa4ddcb59863756a8ce))
* **arcgis-rest-portal:** add getPortalSettings function ([e956dc5](https://github.com/Esri/arcgis-rest-js/commit/e956dc56e2fb925478767d989e4cf42cb8ac1a1c))
* **arcgis-rest-portal:** add searchUsers function ([235766c](https://github.com/Esri/arcgis-rest-js/commit/235766c7eb7a55276f89e107cee8c4b4f8b64a84))
* **getItemBaseUrl:** add function to get the base REST API URL for an item ([d6ec9fc](https://github.com/Esri/arcgis-rest-js/commit/d6ec9fcafbdeafc2a33d38787baa3a1d7fb1ec69))
* **getItemInfo:** add a function to fetch an info file for an item ([a9dd7d6](https://github.com/Esri/arcgis-rest-js/commit/a9dd7d64834424ca348fb92818d616bb74e29a6e)), closes [#738](https://github.com/Esri/arcgis-rest-js/issues/738)
* **getItemMetadata:** add a function to fetch the metadata XML for an item ([c263e1b](https://github.com/Esri/arcgis-rest-js/commit/c263e1bd7c13cb1ee65e5c23f994650820c023a6))
* **getJsonResource and scrubControlChars:** add getJsonResource and scrubControlChars ([6bb9215](https://github.com/Esri/arcgis-rest-js/commit/6bb921512eeed9374ab35c03577fd3bfb8ea1e11))
* add resourcesPrefix parameter to addItemResource ([c368232](https://github.com/Esri/arcgis-rest-js/commit/c3682322f7aca69c0dd3907a603304d232d8b43c))
* **group:** refactor searchGroups to make use of SearchQueryBuilder ([72f2898](https://github.com/Esri/arcgis-rest-js/commit/72f28985bde12b44cca0180dd52e33f660f2ad9a)), closes [#104](https://github.com/Esri/arcgis-rest-js/issues/104)
* **portal:** a new function to add members to a given group ([998d3a7](https://github.com/Esri/arcgis-rest-js/commit/998d3a705aac0ebdd59bacdbae2f48924cad86ff)), closes [#584](https://github.com/Esri/arcgis-rest-js/issues/584)
* **portal:** add reassignItem ([1756cc4](https://github.com/Esri/arcgis-rest-js/commit/1756cc48f43436f3041e44ed14827f415b106a90))
* **portal:** add the function to get user tags ([#614](https://github.com/Esri/arcgis-rest-js/issues/614)) ([d49159f](https://github.com/Esri/arcgis-rest-js/commit/d49159f91b3236feaf6dfb5df202672faae82797))
* **portal:** add updateGroupMembership, isItemSharedWithGroup ([14848db](https://github.com/Esri/arcgis-rest-js/commit/14848dbd6034362628ef99c8d57d445c8ed37776))
* **portal:** searchGroupUsers searches the users in the given group ([d9151a1](https://github.com/Esri/arcgis-rest-js/commit/d9151a15fb34ae0ddc551f350e877ff7dd10405e))


### Reverts

* Revert "aggs counts should be an array" ([55a1e27](https://github.com/Esri/arcgis-rest-js/commit/55a1e27c3d84383bceac86442987806249f4a6b3))


### BREAKING CHANGES

* deprecated addItemJsonData
* **portal interfaces:** removes "Request" from portal option interfaces & renames response interfaces
* **group:** searchGroups signature change
* replace items, groups, sharing and user packages with single portal package





### Dependencies

* **@esri/arcgis-rest-request:** upgraded to 1.0.0-beta.1
