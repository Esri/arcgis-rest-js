# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.23.0] - December 7th 2020

### @esri/arcgis-rest-request

- New Features
  - **request** sets `fetch.credentials: 'include'` when specific headers are set. This is intended to support the `platformSelf` call which needs to send cookies, even when cross-domain.

### @esri/arcgis-rest-auth

- Bug Fixes
  - **platformSelf**: actually export the function from the package

## [2.22.0] - November 18th 2020

### @esri/arcgis-rest-auth

- New Features
  - **UserSession**: added optional popupWindowFeatures to IOAuth2Options [`f96a5810`](https://github.com/Esri/arcgis-rest-js/commit/f96a581033513c9a546998bc37254a46e364f153)

### @esri/arcgis-rest-request

- Bug Fixes
  - **processParams**: Support array of arrays [`08208d37`](https://github.com/Esri/arcgis-rest-js/commit/fd3b1a999f63a62d50d60b2b1f6b775d482be85c)

## [2.21.0] - November 11th 2020

### @esri/arcgis-rest-feature-layer

- New Features
  - **arcgis-rest-types**: add editingInfo to ILayerDefinition [`e5467f0b`](https://github.com/Esri/arcgis-rest-js/commit/e5467f0bcc611cd9b928c2f0dd46567794a699c5)

### @esri/arcgis-rest-portal

- Bug Fixes
  - **arcgis-rest-portal**: make \`layers\` parameter of \`IExportParameters\` optional [`0b584e66`](https://github.com/Esri/arcgis-rest-js/commit/0b584e66396a9559248e597ec44b256f95fc58e7)

### @esri/arcgis-rest-service-admin

- New Features
  - **service-admin**: add updateServiceDefinition method [`63c2bc09`](https://github.com/Esri/arcgis-rest-js/commit/63c2bc09f3c06387f8aabc00be2a84ec2f71e35b)

### @esri/arcgis-rest-types

- New Features
  - **arcgis-rest-types**: add editingInfo to ILayerDefinition [`e5467f0b`](https://github.com/Esri/arcgis-rest-js/commit/e5467f0bcc611cd9b928c2f0dd46567794a699c5)

### Other Changes

- New Features
  - **arcgis-rest-auth**: add validateAppAccess function and UserSession method [`2478ea56`](https://github.com/Esri/arcgis-rest-js/commit/2478ea56d43302d3f7fab6ffd38a9d2c609bb510)
  - **auth**: add functions to help with removal of esri_auth cookie [`eb5abae9`](https://github.com/Esri/arcgis-rest-js/commit/eb5abae90904f36d800bcb7eca5cbebe264a48a8)
  - **service-admin**: add updateServiceDefinition method [`ed3e37f6`](https://github.com/Esri/arcgis-rest-js/commit/ed3e37f61589cc7f153d66d3fac46f49a64a50f0)

## [2.20.0] - October 20th 2020

### @esri/arcgis-rest-auth

- Documentation
  - **arcgis-rest-auth**: doc updates [`1d527653`](https://github.com/Esri/arcgis-rest-js/commit/1d52765378756d8fa61182034318f0585617db4e)
- New Features
  - **arcgis-rest-auth**: add postMessage auth support [`a6b8a17a`](https://github.com/Esri/arcgis-rest-js/commit/a6b8a17a265339725a8c5dfd90e408f28a035787)
  - **arcgis-rest-auth**: reduce postMessageAuth query params [`154515f6`](https://github.com/Esri/arcgis-rest-js/commit/154515f66a4eedb9ee83dd8528549db55e268871)

## [2.19.2] - October 13th 2020

### @esri/arcgis-rest-portal

- Bug Fixes
  - **arcgis-rest-portal**: do not do any membership adjustments if the group is the user&amp;amp;amp;amp;amp;#39;s favorites g [`6fc8ada6`](https://github.com/Esri/arcgis-rest-js/commit/6fc8ada666e2ac6388418d3416db13a40c299757)

## [2.19.1] - October 2nd 2020

### @esri/arcgis-rest-portal

- Bug Fixes
  - **arcgis-rest-portal**: wrong parameters for file upload APIs (#761) [`cbfef7d6`](https://github.com/Esri/arcgis-rest-js/commit/cbfef7d6bd669d323dab5299966217a956fc5cfb) [#693](https://github.com/Esri/arcgis-rest-js/issues/693) [#694](https://github.com/Esri/arcgis-rest-js/issues/694) [#700](https://github.com/Esri/arcgis-rest-js/issues/700) [#761](https://github.com/Esri/arcgis-rest-js/issues/761)

## [2.19.0] - September 28th 2020

### @esri/arcgis-rest-portal

- New Features
  - **scrubControlChars**: add scrubControlChars [`6bb92151`](https://github.com/Esri/arcgis-rest-js/commit/6bb921512eeed9374ab35c03577fd3bfb8ea1e11)

## [2.18.0] - September 11th 2020

### @esri/arcgis-rest-portal

- New Features
  - **getItemBaseUrl**: add function to get the base REST API URL for an item [`d6ec9fca`](https://github.com/Esri/arcgis-rest-js/commit/d6ec9fcafbdeafc2a33d38787baa3a1d7fb1ec69)
  - **getItemInfo**: add a function to fetch an info file for an item [`a9dd7d64`](https://github.com/Esri/arcgis-rest-js/commit/a9dd7d64834424ca348fb92818d616bb74e29a6e) [#738](https://github.com/Esri/arcgis-rest-js/issues/738)
  - **getItemMetadata**: add a function to fetch the metadata XML for an item [`c263e1bd`](https://github.com/Esri/arcgis-rest-js/commit/c263e1bd7c13cb1ee65e5c23f994650820c023a6)

## [2.17.0] - September 3rd 2020

- Refactoring

  - **arcgis-rest-portal**: isOrgAdmin more accurately identifies org admins [144791](https://esriarlington.tpondemand.com/entity/144791-search-filter-and-select-groups-to)
  - **arcgis-rest-portal**: Separated shareItemWithGroup and unshareItemWithGroup into separate methods and files [144791](https://esriarlington.tpondemand.com/entity/144791-search-filter-and-select-groups-to)
  - **arcgis-rest-portal**: Loosened unshare restrictions for org admins, they can now remove any item in their org from a group regardless of their membership to that group. [144791](https://esriarlington.tpondemand.com/entity/144791-search-filter-and-select-groups-to)
  - **arcgis-rest-portal**: Added logic for org admins to conditionally join edit/update groups as a group admin, or view groups as a member before sharing, then removes the admin after the share call completes. If the admin is already a member, the addUser call is skipped and the admin is not removed. [144791](https://esriarlington.tpondemand.com/entity/144791-search-filter-and-select-groups-to)

- New Features
  - **arcgis-rest-portal**: Added removeUsers [144791](https://esriarlington.tpondemand.com/entity/144791-search-filter-and-select-groups-to)

## [2.16.0] - August 31st 2020

### @esri/arcgis-rest-portal

- Bug Fixes

  - **arcgis-rest-portal**: use deleteRelationship not removeRelationship [`890e4859`](https://github.com/Esri/arcgis-rest-js/commit/890e4859dc45ce1588b5ba3573c881c227267bf9) [#739](https://github.com/Esri/arcgis-rest-js/issues/739)
  - **arcgis-rest-request**: `cleanUrl` function now resilient to null values

- New Features
  - **arcgis-rest-portal** `updateItem` respects a `.folderId` property passed in `IUpdateItemOptions`

### General

- ensure all projects use tslib ^1.10.0
- bump `rollup-plugin-typescript2` to `0.22.0` which also uses ^1.10.0

## [2.15.0] - August 19th 2020

### @esri/arcgis-rest-portal

- New Features
  - **portal** `inviteGroupUsers` - Invites users to join a group
  - **portal** `createOrgNotification` - Send notifications to members of an org - either via email or internal

### @esri/arcgis-rest-auth

- Bug Fixes
  - **auth**: add additional authentication providers [`85f73b22`](https://github.com/Esri/arcgis-rest-js/commit/85f73b22c17a3a3ae72b559a63df2aef8297828c)
  - **auth**: improve query and error handling when completing sign in [`4b3905ca`](https://github.com/Esri/arcgis-rest-js/commit/4b3905ca6517443c9237a44c0fc3249e579db8f5)

### @esri/arcgis-rest-request

- Bug Fixes
  - **auth**: improve query and error handling when completing sign in [`4b3905ca`](https://github.com/Esri/arcgis-rest-js/commit/4b3905ca6517443c9237a44c0fc3249e579db8f5)

## [2.14.1] - July 23rd 2020

### @esri/arcgis-rest-portal

- Bug Fixes
  - added `exportItem` allows `targetSR` to be a `string` or an `ISpatialReference`

## [2.14.0] - July 20th 2020

### @esri/arcgis-rest-auth

- Bug Fixes
  - **arcgis-rest-auth**: enable oAuth from within an IFrame [`e6538d5d`](https://github.com/Esri/arcgis-rest-js/commit/e6538d5d38c9b2d0f31c6392d257f0d9263170bd) [#711](https://github.com/Esri/arcgis-rest-js/issues/711)

### @esri/arcgis-rest-portal

- New Features
  - added `exportItem` and `getUserContent` functions

## [2.13.2] - June 11th 2020

### @esri/arcgis-rest-service-admin

- Optimization
  - **arcgis-rest-service-admin**: Function `createFeatureService` creates the feature service directly in a specified folder rather than creating it at the root and moving it to the folder [aa478ca](https://github.com/Esri/arcgis-rest-js/pull/689/commits/aa478caf5dfd9290d4adce2ad704973008d68887)

## [2.13.1] - May 12th 2020

### @esri/arcgis-rest-request

- Bug Fixes
  - **request**: Patch hideToken for browser CORS support [b97860](https://github.com/Esri/arcgis-rest-js/commit/b978605f08810bbd5f0b568b36afd3f8f2adbdb2)

## [2.13.0] - May 6th 2020

### @esri/arcgis-rest-request

- New Features
  - **request**: Add `hideToken` option to prevent passing token in query parameters [8595fab](https://github.com/Esri/arcgis-rest-js/commit/8595fabe347a4b0d1718060b12956624308e8ab1)

## [2.12.1] - May 3rd 2020

### @esri/arcgis-rest-types

- Bug Fixes
  - Add the missing `s` in IStatisticDefinition. [c807192](https://github.com/Esri/arcgis-rest-js/commit/c8071921df9424961a325ef2875591a3a3809d94)

## [2.12.0] - April 27th 2020

### @esri/arcgis-rest-portal

- New Features
  - **arcgis-rest-portal**: add getPortalSettings function [`e956dc56`](https://github.com/Esri/arcgis-rest-js/commit/e956dc56e2fb925478767d989e4cf42cb8ac1a1c)

## [2.11.0] - April 6th 2020

### @esri/arcgis-rest-auth

- New Features
  - Added getGroupCategorySchema [66ce599](https://github.com/Esri/arcgis-rest-js/commit/66ce5997911b78283db95affcf08333ed4574f3e)
  - Added support for group contents search [ef4e404](https://github.com/Esri/arcgis-rest-js/commit/ef4e40496711ed43cde24ababaefe0f1feb7763d)

### @esri/arcgis-rest-types

- Bug Fixes
  - Revert Merge pull request #656 to remove const enums usage. [ea218f0](https://github.com/Esri/arcgis-rest-js/commit/ea218f0f6e898308109f7fda6daa70464ac21f79)

## [2.10.1] - April 3rd 2020

### @esri/arcgis-rest-auth

- New Features
  - **UserSession** Add support for unmanaged sessions, async determineOwner [b8d099a](https://github.com/Esri/arcgis-rest-js/commit/b8d099ab863701cb10e7692c3817840ee6c0c8ec)

### @esri/arcgis-rest-portal

- New Features

  - **portal** Add resourcesPrefix parameter to addItemResource [c368232](https://github.com/Esri/arcgis-rest-js/pull/684/commits/c3682322f7aca69c0dd3907a603304d232d8b43c)

- Bug Fixes
  - If the data returned by `getItemData()` is empty, return null [05627f8](https://github.com/Esri/arcgis-rest-js/commit/05627f89c517dd3a69b9b92dd9f313144f266190)

## [2.10.0] - March 17th 2020

### @esri/arcgis-rest-portal

- New Features

  - **updateinfo** Added function for updateinfo [0c068fc](https://github.com/Esri/arcgis-rest-js/commit/0c068fcd6daa5d2aad6a28c29653eff71cdddbd9)

- Bug Fixes
  - **shareToGroupAsNonOwner**: No longer trying to promote group owner to group admin [84a7d41](https://github.com/Esri/arcgis-rest-js/commit/84a7d41719db0da46518163b1de14eb822d9f071)

## [2.9.0] - March 1st 2020

### @esri/arcgis-rest-feature-layer

- New Features
  - **portal**: add updateGroupMembership, isItemSharedWithGroup [`14848dbd`](https://github.com/Esri/arcgis-rest-js/commit/14848dbd6034362628ef99c8d57d445c8ed37776)

### @esri/arcgis-rest-portal

- Documentation
  - **portal**: fix comment in code [`5afe3be9`](https://github.com/Esri/arcgis-rest-js/commit/5afe3be91121223d89f4db2df43553ce1082641d)
- New Features
  - **portal**: add reassignItem [`1756cc48`](https://github.com/Esri/arcgis-rest-js/commit/1756cc48f43436f3041e44ed14827f415b106a90)
  - **portal**: add updateGroupMembership, isItemSharedWithGroup [`14848dbd`](https://github.com/Esri/arcgis-rest-js/commit/14848dbd6034362628ef99c8d57d445c8ed37776)

### @esri/arcgis-rest-service-admin

- New Features
  - **portal**: add updateGroupMembership, isItemSharedWithGroup [`14848dbd`](https://github.com/Esri/arcgis-rest-js/commit/14848dbd6034362628ef99c8d57d445c8ed37776)

### Other Changes

- New Features
  - **portal**: add reassignItem [`2fe62ae7`](https://github.com/Esri/arcgis-rest-js/commit/2fe62ae7897506c3133f18aeed94ce4f3e793aca)
  - **portal**: add updateGroupMembership, isItemSharedWithGroup [`ab3fefc0`](https://github.com/Esri/arcgis-rest-js/commit/ab3fefc0c6751ae84c69bd9a84797e53abf57e83)

## [2.8.2] - February 24th 2020

### @esri/arcgis-rest-portal

- Bug Fixes
  - **getItemResources**: do not mutate requestOptions in getItemResources [`cac63e80`](https://github.com/Esri/arcgis-rest-js/commit/cac63e8090b81a6fe2258529060bc6f3f0611fb0)
  - **getItemResources**: allow user to override paging [`97cbec0b`](https://github.com/Esri/arcgis-rest-js/commit/97cbec0b918e0ec914beb60abdb36d1265ce5645)

### Other Changes

- Bug Fixes
  - **getItemResources**: do not mutate requestOptions in getItemResources [`47841cd3`](https://github.com/Esri/arcgis-rest-js/commit/47841cd39b37a4d18ea0c2acf95a5844543045a3)

## [2.8.1] - January 29th 2020

### @esri/arcgis-rest-auth

- Bug Fixes

  - **`UserSession.completeOAuth2()`**: Fixes an edge case where calling `UserSession.completeOAuth2()` from a window opened with `window.open()` with `{popup: false}` accross domains would fail. [25778e3e](https://github.com/Esri/arcgis-rest-js/commit/25778e3e6b16d73cc22a79a7b9bc1c97f4f90ac4)

## [2.8.0] - January 28th 2020

### @esri/arcgis-rest-types

- New Features

  - **Add properties to IStatisticDefinition to support percentiles**: Added optional `statisticParameter` property to support new `percentile_disc` types. [8edec3ff](https://github.com/Esri/arcgis-rest-js/pull/650/commits/8edec3ff7d91bc583dfd30db23067bee0e86887e)

  - **Export `IStatisticDefinition` interface**: [a6ac91b7](https://github.com/Esri/arcgis-rest-js/pull/651/commits/a6ac91b713510391e86819fa51595440cc1533ce)

## [2.7.2] - January 26th 2020

### @esri/arcgis-rest-portal

- Bug Fixes
  - **sharing**: correct the item sharing logic to reflect what the api actually allows [`48b67e54`](https://github.com/Esri/arcgis-rest-js/commit/48b67e542ed41dda798ebfd51321d51729af2b5b)
  - **sharing**: only item owner, group owner or group admin can unshare [`d264137c`](https://github.com/Esri/arcgis-rest-js/commit/d264137cbc51955320c48bad0bd868116832de79)

### @esri/arcgis-rest-types

- Bug Fixes
  - **sharing**: correct the item sharing logic to reflect what the api actually allows [`48b67e54`](https://github.com/Esri/arcgis-rest-js/commit/48b67e542ed41dda798ebfd51321d51729af2b5b)
  - **types**: add missing relationship types [`bf3e6c6a`](https://github.com/Esri/arcgis-rest-js/pull/649/commits/bf3e6c6a47b8626b508664d7ce37181047e5c825)

## [2.7.1] - January 13th 2020

### @esri/arcgis-rest-auth

- Bug Fixes
  - **UserSession**: will now update expired tokens on non-federated servers [`af121c1d`](https://github.com/Esri/arcgis-rest-js/commit/af121c1de1c96027a2ca107ed46a7877b61c5a4f)

## [2.7.0] - December 23rd 2019

### @esri/arcgis-rest-portal

- New Features

  - **Add Portal getSubscriptionInfo fn**: Added a Portal `getSubscriptionInfo` method -- essentially the same thing as `getPortal` or `getSelf` but with `/subscriptionInfo` appended to the URL. [e7f6df5](https://github.com/Esri/arcgis-rest-js/pull/642/commits/e7f6df5459eda1a8e26dfeee37593250762ec9a1)

### @esri/arcgis-rest-feature-layer

- New Features
  - **add applyEdits function**: adds \`applyEdits()\` to feature-layer for bulk crud transactions. [`ec368418`](https://github.com/Esri/arcgis-rest-js/commit/ec3684183c5689cd27d20ebfdc79af69a41135e2)

### Other Changes

- New Features
  - **Quick Param Updates**: Added a Portal `getSubscriptionInfo` method -- essentially the same thing as `getPortal` or `getSelf` but with `/subscriptionInfo` appended to the URL. [e7f6df5](https://github.com/Esri/arcgis-rest-js/pull/642/commits/e7f6df5459eda1a8e26dfeee37593250762ec9a1)

## [2.6.1] - November 14th 2019

### @esri/arcgis-rest-portal

- Bug Fixes
  - **arcgis-rest-portal**: aggs counts should be an array [`c9f26b9a`](https://github.com/Esri/arcgis-rest-js/commit/c9f26b9ab15cfb6a7bc0d9422c3f06e8a56d0d52)

## [2.6.0] - October 22nd 2019

### @esri/arcgis-rest-portal

- New Features
  - **arcgis-rest-portal**: add searchUsers function [`b91af15a`](https://github.com/Esri/arcgis-rest-js/commit/b91af15a0524ace69edfdaa5ccdea9da257746a9)

## [2.5.0] - October 15th 2019

### @esri/arcgis-rest-portal

- New Features
  - **portal**: add the function to get user tags (#614) [`d49159f9`](https://github.com/Esri/arcgis-rest-js/commit/d49159f91b3236feaf6dfb5df202672faae82797)
  - **portal**: add `commitItemUpload()` and `cancelItemUpload()` functions for item file upload
  - **portal**: add `overwrite` paramter for item creation

### Other Changes

- Bug Fixes
  - **searchGroupUsers func**: searchOptions is now an optional parameter [`d54bddb6`](https://github.com/Esri/arcgis-rest-js/commit/d54bddb69f003109aac7a3b27be420b465e4f59f) [#615](https://github.com/Esri/arcgis-rest-js/issues/615)

## [2.4.0] - August 29th 2019

### @esri/arcgis-rest-portal

- New Features
  - **portal**: new functions and parameters to support async and multiple upload during item creation [#611](https://github.com/Esri/arcgis-rest-js/issues/611)
  - **portal**: add the function to get user tags (#614) [`d49159f`](https://github.com/Esri/arcgis-rest-js/commit/d49159f91b3236feaf6dfb5df202672faae82797)

## [2.3.0] - August 8th 2019

### @esri/arcgis-rest-geocoding

- Bug Fixes
  - **geocode**: ensure the magicKey property is passed through. (#603) [`cc2c352a`](https://github.com/Esri/arcgis-rest-js/commit/cc2c352accd8b0090177f3b45fec68d95431b96e) [#601](https://github.com/Esri/arcgis-rest-js/issues/601) [#603](https://github.com/Esri/arcgis-rest-js/issues/603)

### @esri/arcgis-rest-portal

- Bug Fixes
  - **portal**: setting item access to public shares correctly [`025406e0`](https://github.com/Esri/arcgis-rest-js/commit/025406e00a369b6a1b40097e7b03d5698ea41744)

### @esri/arcgis-rest-types

- Chores
  - **node**: support Node 12 [`9e21d3d5`](https://github.com/Esri/arcgis-rest-js/commit/9e21d3d539ae98f090ecdc8a74ee86f5f045949c)

### Other Changes

- Chores
  - **node**: support Node 12 [`8dbce6ae`](https://github.com/Esri/arcgis-rest-js/commit/8dbce6ae9aa0fab8c319abb89a87008def419ef9)

## [2.2.1] - July 22nd 2019

### @esri/arcgis-rest-portal

- Bug Fixes
  - **portal**: searchGroupUsers will now respect joined and memberType parameters [`79b15b5`](https://github.com/Esri/arcgis-rest-js/commit/79b15b5a00ec3efed2193d3d16f61417bfcc933d)

### Other Changes

- Bug Fixes
  - **portal**: searchGroupUsers will now respect additional parameters [`0768eab`](https://github.com/Esri/arcgis-rest-js/commit/0768eab390912591e0aadbfbed114a306d991a01)

## [2.2.0] - July 18th 2019

### @esri/arcgis-rest-portal

- New Features
  - **portal**: searchGroupUsers searches the users in the given group [`d9151a15`](https://github.com/Esri/arcgis-rest-js/commit/d9151a15fb34ae0ddc551f350e877ff7dd10405e)

## [2.1.1] - July 15th 2019

### @esri/arcgis-rest-feature-layer

- Bug Fixes
  - **queryFeatures**: pass along f, geometry, geometryType, and spatialRel params [`f4b775d1`](https://github.com/Esri/arcgis-rest-js/commit/f4b775d1b4ee6b45cd2be04009023ac12958ce31) [#588](https://github.com/Esri/arcgis-rest-js/issues/588)

### @esri/arcgis-rest-auth

- Bug Fixes
  - **federation**: Fixes for federation and shortcutting federations [`9d91ba6`](https://github.com/Esri/arcgis-rest-js/commit/9d91ba68510e82b85053a5ec9da3d13e60a62441) [#596](https://github.com/Esri/arcgis-rest-js/issues/596)

## [2.1.0] - June 18th 2019

### @esri/arcgis-rest-portal

- New Features
  - **portal**: a new function to add members to a given group [`998d3a70`](https://github.com/Esri/arcgis-rest-js/commit/998d3a705aac0ebdd59bacdbae2f48924cad86ff) [#584](https://github.com/Esri/arcgis-rest-js/issues/584)

## [2.0.4] - June 14th 2019

### @esri/arcgis-rest-auth

- Bug Fixes
  - **server root url**: improve discovery of services endpoint root url [`b2eed908`](https://github.com/Esri/arcgis-rest-js/commit/b2eed9085f4103a982c00cfcdf176df87b251cda) [#581](https://github.com/Esri/arcgis-rest-js/issues/581)

### Other Changes

- Chores
  - **chore**: bump rollup (and family) (#575) [`f7a88f74`](https://github.com/Esri/arcgis-rest-js/commit/f7a88f74fe0687db102a7371b47b27d0a9ad36cb)

## [2.0.3] - May 23rd 2019

### @esri/arcgis-rest-auth

- Bug Fixes
  - Federation will no longer lowercase the URL path, only the domain [`7788b21`](https://github.com/Esri/arcgis-rest-js/commit/7788b21dc49baefcbdfbd383effe4e652db72b99)

## [2.0.2] - May 20th 2019

### @esri/arcgis-rest-auth

- Bug Fixes
  - Federation is now forced across different ArcGIS Online environments [`1db161b`](https://github.com/Esri/arcgis-rest-js/commit/1db161b5a424c672432be4f552e63736c641ad48)

### @esri/arcgis-rest-request

- Misc.
  - **chore**: remove circular dependency in request package [`1d47666a`](https://github.com/Esri/arcgis-rest-js/commit/1d47666a125834bb605e78e7b827ebe4f8c999ce) [#565](https://github.com/Esri/arcgis-rest-js/issues/565)

## [2.0.1] - May 6th 2019

### @esri/arcgis-rest-auth

- New Features
  - when an authenticated session is passed through in a request to an unfederated instance of ArcGIS Server, an attempt to see if it is public is made before throwing a `NOT_FEDERATED` error. [`6a24b02`](https://github.com/Esri/arcgis-rest-js/commit/6a24b0215992cb12d79cac547f77b03617928766)

### @esri/arcgis-rest-portal

- Bug Fixes
  - `sortOrder` is now used consistently as a request option in search functions. [`9caeafd`](https://github.com/Esri/arcgis-rest-js/commit/9caeafdea4568252b792606dcd485486c4e1f5c8)
  - `ISearchResult` now exposes `aggregations`. [`60d4072`](https://github.com/Esri/arcgis-rest-js/commit/60d407276d6e5687021a316ead15ee0a9cac911a)
  - `SearchQueryBuilder` no longer inserts a space between search fields and terms. [`391e3f8`](https://github.com/Esri/arcgis-rest-js/commit/391e3f8ef494e2de4339f36b19aa3d34aed722fd)
  - `SearchQueryBuilder` now allows NOT as a standalone modifier. [`36a6bca`](https://github.com/Esri/arcgis-rest-js/commit/36a6bca771dd4282af71dcf454828f58047b525b)
  - `SearchQueryBuilder` now allows untyped, grouped search strings. [`39fc213`](https://github.com/Esri/arcgis-rest-js/commit/39fc21379a3e78a27636d62cf46d86e23ad666a0)

### @esri/arcgis-rest-feature-layer

- Bug Fixes
  - `IEditFeatureResult` is now exported. [`2c65102`](https://github.com/Esri/arcgis-rest-js/commit/2c651023f3a04cb0ad5884195c13ed01f5d57543)
  - `getAttachments` now defaults to a GET instead of a POST [`044f1a0`](https://github.com/Esri/arcgis-rest-js/commit/044f1a0653b4762682c22d40c88fa34b5aef1f6d)
  - Properties on CRUD response interfaces are no longer optional [`be71c17`](https://github.com/Esri/arcgis-rest-js/commit/be71c17706eb66a828eb56102159fd00cb494b27)

### Other Changes

- Bug Fixes
  - UMD builds no longer include a dependency on types [`3b41f3d`](https://github.com/Esri/arcgis-rest-js/commit/3b41f3d6befa5e4bcbced15a9147ca7b6f47f33d)

## [2.0.0] - April 22nd 2019

For a more readable explanation of the new features and breaking changes in this release, please take a look at [What is new in `v2.0.0`](https://esri.github.io/arcgis-rest-js/guides/whats-new-v2-0/).

### @esri/arcgis-rest-request

- New Features

  - A new [`withOptions`](https://esri.github.io/arcgis-rest-js/api/request/withOptions/) method has been added to aid in passing through common request options to other individual methods repeatedly.
  - A new [`setDefaultRequestOptions`](https://esri.github.io/arcgis-rest-js/api/request/setDefaultRequestOptions/) method has been added to aid in passing through common request options in \*_all_ requests.

- Breaking Changes
  - The utility methods `getPortalUrl` and `getPortal` have been moved to the `portal` package.

### @esri/arcgis-rest-auth

- Breaking Changes
  - The utility method `getUserUrl` has been moved to the `portal` package.
  - The internal methods `generateToken` and `fetchToken` now expect _only_ options.
  - `IOauth2Options` has been renamed `IOAuth2Options`.

### @esri/arcgis-rest-portal

This new package contains the methods previously found in `@esri/arcgis-rest-items`, `groups`, `users` and `sharing`. The individual packages have been deprecated.

- New Features

  - A new class [`SearchQueryBuilder`](https://esri.github.io/arcgis-rest-js/api/portal/SearchQueryBuilder/) has been introduced to help generate complex ArcGIS query strings.

- Bug Fixes

  - **add resource**: `resource` is now an optional parameter when calling `addItemResource` to better support plain text [`1db78b7a`](https://github.com/Esri/arcgis-rest-js/commit/1db78b7a647035f2094058b66cc5ac0286aa03cb)
  - `createItem` and `updateItem` now support binary item `/data`.

- Breaking Changes
  - **group**: The signatures of `searchGroups` and `searchItems` now match, making use of `SearchQueryBuilder` instead of a searchForm. [`72f28985`](https://github.com/Esri/arcgis-rest-js/commit/72f28985bde12b44cca0180dd52e33f660f2ad9a) [#104](https://github.com/Esri/arcgis-rest-js/issues/104)
  - `createItemInFolder` now expects a `folderId` (instead of `folder`).
  - The signature of `getItemResources` has been updated (for consistency with the rest of `rest-js`.
  - **portal interfaces**: request/response interfaces have been renamed to match their functions [`faa5b3dd`](https://github.com/Esri/arcgis-rest-js/commit/faa5b3dd5b51800db4931735f05a367c8fcd42e2)
  - The method `addItemJsonData` has been deprecated. `addItemData` (and other methods now handle _both_ binary files and object literals.
  - **portal interfaces**: request/response interfaces have been renamed to match their functions [`faa5b3dd`](https://github.com/Esri/arcgis-rest-js/commit/faa5b3dd5b51800db4931735f05a367c8fcd42e2)

### @esri/arcgis-rest-feature-layer

- Breaking Changes
  - This package has been renamed from `feature-service` to `feature-layer` (to disambiguate).
  - `addFeatures` and `updateFeatures` now expect a `features` argument (instead of adds/updates)
  - `deleteFeatures` now expects a `objectIds` argument (instead of deletes)
  - `getLayer` now expects a single argument.
  - **feature-layer**: Shared `IParams` interfaces have been removed (for consistency) [`4adff112`](https://github.com/Esri/arcgis-rest-js/commit/4adff112e30c5f6bc565c593a899d6372a9c48cc)
  - **feature responses**: `Result` and `Response` interfaces have been removed [`1948010b`](https://github.com/Esri/arcgis-rest-js/commit/1948010b1077a4ab5edea82ea46ca0a3c9cf437c)
  - **interfaces**: `Request` has been removed from option interface names [`8bce221e`](https://github.com/Esri/arcgis-rest-js/commit/8bce221e3f07510f392bf561a9f3863fb26cfa7e)

### @esri/arcgis-rest-geocoding

- Breaking Changes
  - This package has been renamed from `geocoder` to `geocoding` (for consistency).
  - The world `Request` has been removed from Options interfaces
  - The constant `worldGeocoder` has been renamed `ARCGIS_ONLINE_GEOCODING_URL`
  - the `serviceInfo` method has been removed (in favor of `getGeocodeService`).
  - The `IGeocodeParams` interface has been removed.

### @esri/arcgis-rest-routing

- Breaking Changes
  - The constant `worldRoutingService` has been renamed `ARCGIS_ONLINE_ROUTING_URL`
  - **interface names**: removes `Request` from interface names in routing and service-admin [`57025262`](https://github.com/Esri/arcgis-rest-js/commit/57025262b0774d2036c117556e256ce7b749719d)

### @esri/arcgis-rest-service-admin

- Breaking Changes
  - This package has been renamed from `feature-service-admin` to `service-admin` (for brevity and flexibility).
  - **interface names**: removes `Request` from interface names in routing and service-admin [`57025262`](https://github.com/Esri/arcgis-rest-js/commit/57025262b0774d2036c117556e256ce7b749719d)
  - **portal interfaces**: renames portal request/response interfaces to match their functions [`faa5b3dd`](https://github.com/Esri/arcgis-rest-js/commit/faa5b3dd5b51800db4931735f05a367c8fcd42e2)

### @esri/arcgis-rest-types

- Breaking Changes
  - This package has been renamed from `common-types` to `types` (for brevity).
  - This package is now a dependency of other upstream `rest-js` packages that will be installed automatically. Relevent interfaces are re-exported so it is no longer necessary to import directly from the helper package.
  - The `esri` prefix has been removed from the `esriUnits`, `esriFieldTypes` and `esriGeometryTypes` types.

### Other Changes

- Breaking Changes
  - Internal helper methods like `appendCustomParams` are no longer documented. In the future, undocumented methods may change without notice.

## [1.19.2] - April 9th 2019

### @esri/arcgis-rest-items

- Bug Fixes
  - ensure `getItemData()` returns `undefined` when no data is present (instead of throwing) [`914a5be`](https://github.com/Esri/arcgis-rest-js/commit/914a5be114362e1c124d0003d448cbb5b35aeeb2)

### @esri/arcgis-rest-auth

- Bug Fixes
  - **lock**: pass through url and options when throwing for non-federated requests [`802006cd`](https://github.com/Esri/arcgis-rest-js/commit/802006cdc68e69851e80c499a236ba4c8fa1cb6f)

### @esri/arcgis-rest-request

- Bug Fixes
  - **lock**: pass through url and options when throwing for non-federated requests [`802006cd`](https://github.com/Esri/arcgis-rest-js/commit/802006cdc68e69851e80c499a236ba4c8fa1cb6f)

## [1.19.1] - April 2nd 2019

### @esri/arcgis-rest-items

- Fixes
  - ensure `updateItemResource()` always utilizes FormData [`24af241`](https://github.com/Esri/arcgis-rest-js/commit/24af24167116e4537bc774b423eaa1fce13d5cd9) [#499](https://github.com/Esri/arcgis-rest-js/issues/499)

## [1.19.0] - March 28th 2019

### @esri/arcgis-rest-\*

- New Features
  - **tree**: better support for tree shaking in webpack [`7fe91548`](https://github.com/Esri/arcgis-rest-js/commit/7fe91548986bd3efdddc2a7efd07ce90f6adf568) [#424](https://github.com/Esri/arcgis-rest-js/issues/424)

### @esri/arcgis-rest-groups

- New Features
  - **join**: new joinGroup and leaveGroup methods [`fa604dec`](https://github.com/Esri/arcgis-rest-js/commit/fa604dec4424b7c1df8d9ce82a93daaa79103ecf)
- Bug Fixes
  - **lock**: make passing authentication mandatory when updating groups [`14bdf888`](https://github.com/Esri/arcgis-rest-js/commit/14bdf888ef77905da89b51bff4d82c0e5db810ea)

### @esri/arcgis-rest-items

- Bug Fixes
  - **null**: dont stringify values in item calls [`c0f48fc0`](https://github.com/Esri/arcgis-rest-js/commit/c0f48fc07d3599dae09ede958eebecd2e02c522f)

### @esri/arcgis-rest-webpack-demo

- Documentation
  - **tree**: add tree shaking demo [`7fe91548`](https://github.com/Esri/arcgis-rest-js/commit/7fe91548986bd3efdddc2a7efd07ce90f6adf568) [#424](https://github.com/Esri/arcgis-rest-js/issues/424)

## [1.18.0] - March 21st 2019

### @esri/arcgis-rest-auth

- New Features
  - **util**: add `getUserUrl` method to auth package [`d742b34`](https://github.com/Esri/arcgis-rest-js/commit/d742b343130a8a0d5baaf9391ac48f5c5c334c6d)

### @esri/arcgis-rest-routing

- New Features

  - **routing**: Support 3D routing [`6b2a77c`](https://github.com/Esri/arcgis-rest-js/commit/6b2a77ce90923bdd80fabd3d47c4be07b0cd8137)

- Fixes
  - **routing**: Fix switched x and y [`cc22727`](https://github.com/Esri/arcgis-rest-js/commit/cc22727cb05a3f7faa43ee7559aedb8f32da7350)

### Other Changes

- Documentation

  - **book**: abbreviate package names in sidebar [`d98f04f`](https://github.com/Esri/arcgis-rest-js/commit/d98f04f2d4cca5b4357bf01f84648e5d67cb32e3)
  - **dupe**: dont display duplicate requestOptions tables [`3bab4f4`](https://github.com/Esri/arcgis-rest-js/commit/3bab4f4ce6325f1cdae97ef03180f3671c3a9cff) [#479](https://github.com/Esri/arcgis-rest-js/issues/479)

- Bug Fixes
  - **common**: Fix location test xy [`27cab54`](https://github.com/Esri/arcgis-rest-js/commit/27cab54b7da1a5fc69fc80d0325f10f0b7adc233)

## [1.17.1] - March 4th 2019

### @esri/arcgis-rest-items

- Misc.
  - `serializeItem()` has been simplified. [`c2d2671`](https://github.com/Esri/arcgis-rest-js/commit/c2d267175c6dc6ce99fb0fb6b3cadbd50707ecef)

### @esri/arcgis-rest-groups

- Fixes

  - ensure create/updateGroup() pass along custom params [`1ccf71e`](https://github.com/Esri/arcgis-rest-js/commit/1ccf71e55ef1ee1e035054a86dd5d8928daa56a1)

- Misc.
  - `serializeGroup()` has been deprecated. it will be removed in v2.0.0. [`c2d2671`](https://github.com/Esri/arcgis-rest-js/commit/c2d267175c6dc6ce99fb0fb6b3cadbd50707ecef)

### Other Changes

- Docs
  - `requestOptions` are now displayed inline on documentation pages.
  - samples now utilize the polyfill.io v3 API.

## [1.17.0] - February 25th 2019

### @esri/arcgis-rest-request

- New Features
  - **request**: adds option to return the raw fetch response [`6fb7c79`](https://github.com/Esri/arcgis-rest-js/commit/6fb7c792f4aab585a06bb1178b41a8687eabc419) [#462](https://github.com/Esri/arcgis-rest-js/issues/462)

### @esri/arcgis-rest-auth

- New Features
  - basic support for interacting with secure, non-federated services [`fc2f06b`](https://github.com/Esri/arcgis-rest-js/commit/fc2f06b74a40261ae9b6bb959048d353be02153b) [#174](https://github.com/Esri/arcgis-rest-js/issues/174)

### @esri/arcgis-rest-items

- New Features
  - add new methods to add and remove item relationships and query for related items [`4e67637`](https://github.com/Esri/arcgis-rest-js/commit/4e676374f90e583639eb2c2f3dc9a554f8aab17a)

### @esri/arcgis-rest-sharing

- Fixes
  - allow organization admins to share public items from outside their organization [`e47a772`](https://github.com/Esri/arcgis-rest-js/commit/e47a772e71c529ff4406ae92ca823a0e9125cf82) [#454](https://github.com/Esri/arcgis-rest-js/issues/454)

### @esri/arcgis-rest-geocoder

- Fixes
  - remove `magicKey` from `suggest()` [`fb2ba9a`](https://github.com/Esri/arcgis-rest-js/commit/fb2ba9ac2ccaf6ed17e02ecb170009b68f638b00) [#459](https://github.com/Esri/arcgis-rest-js/issues/459)

### Other Changes

- Docs
  - the correct base path is now launched in the browser automatically when spinning up the documentation site locally [`68e0ace`](https://github.com/Esri/arcgis-rest-js/commit/68e0acec753334fda70116e3a742ac8643eaafdc)

### stream-response-to-file

- New Features
  - **request**: adds option to return the raw fetch response [`6fb7c79`](https://github.com/Esri/arcgis-rest-js/commit/6fb7c792f4aab585a06bb1178b41a8687eabc419) [#462](https://github.com/Esri/arcgis-rest-js/issues/462)

## [1.16.1] - January 30th 2019

### @esri/arcgis-rest-feature-service-admin

- Fixes
  - ensure createFeatureService doesnt swallow errors [`8173aa5`](https://github.com/Esri/arcgis-rest-js/commit/8173aa5c2d92b2f3f47ff108a8fb575fe449b99b) 🙏MikeTschudi🙏

## [1.16.0] - January 23rd 2019

### @esri/arcgis-rest-items

- New Features
  - new `getItemGroups()` method [`c0cd950`](https://github.com/Esri/arcgis-rest-js/commit/c0cd9509c6c4a1ef8cae33b9673e7a2f9fef90e7)
  - new `removeFolder()` method [`b915ecb`](https://github.com/Esri/arcgis-rest-js/commit/b915ecbe1cad6cea468f1483001daf4f397a7157)

### @esri/arcgis-rest-request

- Fixes
  - dont misinterpret custom referer headers as request parameters [`4ff33b1`](https://github.com/Esri/arcgis-rest-js/commit/4ff33b19809877e60a103ba10139bb4073d536e8)
  - dont set referer headers to null in browser apps [`0b1bf2b`](https://github.com/Esri/arcgis-rest-js/commit/0b1bf2bcf7ba2e6f0889e3fd36bad6750cce4fcb)

## [1.15.2] - January 17th 2019

### @esri/arcgis-rest-request

- New Features
  - **arcgis-rest-js**: add a headers option to IRequestOptions and pass on the headers to the request [`266b85a`](https://github.com/Esri/arcgis-rest-js/commit/266b85a5ce2016606d6fcadddfd34932b08b4be8) 🙏rgwozdz🙏

### @esri/arcgis-rest-users

- New Features
  - **arcgis-rest-users**: added `updateUser()` method [`33ce92d`](https://github.com/Esri/arcgis-rest-js/commit/33ce92dfd36dadcd76ec98150097c38b1041e9d0)

### Other Changes

- Documentation
  - **cdn**: add sri hashes [`49fa5cd`](https://github.com/Esri/arcgis-rest-js/commit/49fa5cdd26fe364bcd8d898c6d79f2d23254d7d9) 🙏COV-GIS🙏

## 1.15.1 - Deprecated

## 1.15.0 - Deprecated

## [1.14.4] - January 11th 2019

### @esri/arcgis-rest-request

- Docs
  - a conceptual guide was written to explain the purpose of this library. [`5502c13`](https://github.com/Esri/arcgis-rest-js/commit/5502c132ec445e43effd7d0566e4681c9dd499d9)

### @esri/arcgis-rest-auth

- Added
  - UserSession.refreshSession() now clears cached user metadata. [`9564158`](https://github.com/Esri/arcgis-rest-js/commit/956415862bd6a07284805b11fd23a949de8157fe)
  - `ApplicationSession` now calculates accurate token expirations. [`5af14d7`](https://github.com/Esri/arcgis-rest-js/commit/5af14d7b10ccee179f7b2da82f4f1478352a8b67)
  - `ApplicationSession`s constuctor now exposes the ability to customize the associated `portal`. [`3ffdddb`](https://github.com/Esri/arcgis-rest-js/commit/3ffdddb9a3faedc39c8782743c419f0a716fbd66)
  - `ApplicationSession`s constructor now exposes the ability to customize the lifespan of generated tokens. [`5af14d7`](https://github.com/Esri/arcgis-rest-js/commit/5af14d7b10ccee179f7b2da82f4f1478352a8b67)

### @esri/arcgis-rest-geocoder

- Bug Fixes
  - ensure that the batch geocoder handles addresses with no match whatsoever [`cba60dc`](https://github.com/Esri/arcgis-rest-js/commit/cba60dca7939e72ca36fa4db0c2fdf817ef182fa)

### Other Changes

- Changed
  - Packages no longer expose a `browser` field in their package.json files. `unpkg` is now used instead to clue the CDN into which specific file to serve up. [`c4e0697d`](https://github.com/Esri/arcgis-rest-js/commit/c4e0697dc1ec66d5cc1919698c79d177d8f57220)

## [1.14.3] - December 3rd 2018

### @esri/arcgis-rest-auth

- Bug Fixes
  - **arcgis-rest-auth**: ensure that mixed casing of federated server urls does not break the system [`07c92f55`](https://github.com/Esri/arcgis-rest-js/commit/07c92f559cc0288fa379d19464f88642c6fe2803)

### demos/oauth2-browser

- Bug Fixes
  ensure that the response is parsed correctly when keep me signed in is checked. [`924f790`](https://github.com/Esri/arcgis-rest-js/commit/924f790efb5a62e885e803de5a744efcf337ebb0)

### Other Changes

- Documentation
  - moved existing code snippets above the fold.
  - added lots more code snippets.
  - made it clearer that JSON `data()` can be passed along when an item is created.

### Other Changes

- Bug Fixes
  - **arcgis-rest-auth**: Allow mixed casing of federated server urls [`c4e0697d`](https://github.com/Esri/arcgis-rest-js/commit/c4e0697dc1ec66d5cc1919698c79d177d8f57220)

## [1.14.2] - November 27th 2018

### @esri/arcgis-rest-request

- Added
  - **`cleanUrl()`** utility method to trim whitespace and remove trailing slashes to standardize input to other methods.

### Other Changes

- Security
  - \*\*:closed_lock_with_key: version locked the devDependency event-stream@3.3.4. see https://github.com/dominictarr/event-stream/issues/116 for more information.

## [1.14.1] - November 21st 2018

### @esri/arcgis-rest-request

- Fixed
- ensure the same `referer` header is used in requests that was supplied when calling `generateToken()`.

### @esri/arcgis-rest-feature-service

- Changed
  - **`features`** is now the preferred argument for `addFeatures()` and `updateFeatures()` and **`objectIds`** for `deleteFeatures()`.

This change was made for consistency with the REST API itself. the old constructor options will still be honored until v2.0.0.

- Misc.
  - **decodeValues**: short circut out of decoding values if there are no CVD fields [`1bac187`](https://github.com/Esri/arcgis-rest-js/commit/1bac187a47be09436d21c721703547aec1334b53)

### Other Changes

- Misc.
  - **decodeValues**: short circut out of decoding values if there are no CVD fields [`891bfb7`](https://github.com/Esri/arcgis-rest-js/commit/891bfb73ba00c74a6281722ff8a067688e9dc71d)

## [1.14.0] - November 14th 2018

### @esri/arcgis-rest-routing

- Added
- New package!
- `solveRoute()` can be used to fetch directions from A to B (or A to Z, or Z to ? to A) 🙏gavinr🙏

### @esri/arcgis-rest-common

- Added
- _Another_ new package to house both shared utility methods and typings for TypeScript users. This package will likely supercede @esri/arcgis-rest-common-types at v2.0.0

### @esri/arcgis-rest-feature-service

- Added
- New `getLayer()` method to fetch metadata for a MapServer or FeatureServer layer.
- New `decodeValues()` utility method which translates raw Coded Value Domain codes in a query response into their more legible descriptions. [`717404f`](https://github.com/Esri/arcgis-rest-js/commit/717404f9827ebe4282fb43ace7df048a6ab679b1)

### @esri/arcgis-rest-request

- Fixed
- ensure a generic `referer` header is passed along in requests from Node.js applications.

- Chores
- refactored a circular dependency out. [`9b58c63`](https://github.com/Esri/arcgis-rest-js/commit/9b58c636f1e5fecb6336979bbd45235e68994452)

### @esri/arcgis-rest-auth

- Fixed
- ensure `session.portal` url is correct when `cred.server` contains sharing/rest.

### @esri/arcgis-rest-common-types

- Added
- added `numViews` and `size` properties to IItem [`1d38da1`](https://github.com/Esri/arcgis-rest-js/commit/1d38da1ed98807dbbf001a694cb97ce0bba1f7e4)

### Other Changes

- Chores
  - **prettier**: updated prettier to better handle newer TS syntax, specifically optional tuple elem [`d2bb7ade`](https://github.com/Esri/arcgis-rest-js/commit/d2bb7ade73c68e94517d089b430b90e585dbc755)

## [1.13.2] - November 2nd 2018

### @esri/arcgis-rest-geocoder

- Bug Fixes
  - **Fixes geocoder issue where it tries to assign a spatial reference to a null extent**: implemented [`bfad9774`](https://github.com/Esri/arcgis-rest-js/commit/bfad9774063c1d5875468136e95f803b4d5dbd65) [#376](https://github.com/Esri/arcgis-rest-js/issues/376)

### @esri/arcgis-rest-groups

- Bug Fixes
  - Ensure createGroup() succeeds when no input tags are passed

### @esri/arcgis-rest-common-types

- Bug Fixes
  - Clarify that `access` is a required property of `IGroupAdd`.

### @esri/arcgis-rest-groups

- Ensure createGroup() succeeds when no input tags are passed

## [1.13.1] - October 15th 2018

### @esri/arcgis-rest-common-types

- Added
  - a few new typings for layer definitions [`8bdb30b`](https://github.com/Esri/arcgis-rest-js/commit/8bdb30bbc65ce0bdda6f0976ad631bb2bc987951)

### @esri/arcgis-rest-request

- Changes
  - added utility method for passing through _lots_ of custom request params that was previously housed in @esri/arcgis-rest-feature-service [`b2a6942`](https://github.com/Esri/arcgis-rest-js/commit/b2a69427eb469adf57367abb2b1ceb168997c14e)

### @esri/arcgis-rest-geocoder

- Fixes
  - ensure all request options are passed through to `geocode()` [`ad28f27`](https://github.com/Esri/arcgis-rest-js/commit/ad28f27bb855436ca64d75898ac3f1e24cb184a8)

### @esri/arcgis-rest-feature-service-admin

- Fixes
  - its now possible to update a service definition without pointing at an existing item id [`462af65`](https://github.com/Esri/arcgis-rest-js/commit/462af65be6f458546db2f2c79e345f17016b153d)

### @esri/arcgis-rest-demo-vanilla

- Documentation
  - **oauth2-browser**: make demo directions for creating an application more specific [`d1acf0ad`](https://github.com/Esri/arcgis-rest-js/commit/d1acf0adf7a7d64e269f8b95137227425d215097)

### Other Changes

- Chores
  - **ci**: only build the master branch when a pull request is submitted [`5a7c82c8`](https://github.com/Esri/arcgis-rest-js/commit/5a7c82c822041ab3cd982df7bc3e7e05fe8065a8)
  - **docs**: add in missing types library from npm install notes [`67788a56`](https://github.com/Esri/arcgis-rest-js/commit/67788a56f91687679ff550e82ccce90b2461d091)
  - **docs**: fix suggest docs [`8cd94a02`](https://github.com/Esri/arcgis-rest-js/commit/8cd94a02ed3f855ea98b7915af4bed0bd4e31d79) 🙏deeg🙏
  - **docs**: more suggest doc fixes [`8abca8fa`](https://github.com/Esri/arcgis-rest-js/commit/8abca8fa71710febea279c06b19a9f6617fb60bf) 🙏deeg🙏
  - add all our contributors to the repo package.json
  - make sure our tslint pre-commit hook only runs once.

## [1.13.0] - October 9th 2018

### @esri/arcgis-rest-common-types

- New Features
  - **users**: add user invitation functions [`80aa6dc`](https://github.com/Esri/arcgis-rest-js/commit/80aa6dcfa1b0297df4f71f191c32ce91c5e62d64)

### @esri/arcgis-rest-users

- New Features
  - **users**: add user invitation functions [`80aa6dc`](https://github.com/Esri/arcgis-rest-js/commit/80aa6dcfa1b0297df4f71f191c32ce91c5e62d64)

### Other Changes

- Documentation
  - **bug**: ensure sticky links are flagged as active in production [`dd7a5ac`](https://github.com/Esri/arcgis-rest-js/commit/dd7a5ac1a3be36736e13292826bae72bd4d21be1)

## [1.12.0] - October 5th 2018

### @esri/arcgis-rest-common-types

- Chores
  - **js**: remove rogue .js files from common-types [`abedb46`](https://github.com/Esri/arcgis-rest-js/commit/abedb462ebf9e78b08f51e221cf8421bc434fd67)

### @esri/arcgis-rest-items

- New Features

  - **js**: It is now possible to add/update private item resources [`b120e9f`](https://github.com/Esri/arcgis-rest-js/commit/b120e9f5462a8bd6631e549ae1bef8dbaa51799e)

- Bug Fixes
  - **js**: updateItemResource now respects the [`resource`](https://esri.github.io/arcgis-rest-js/api/items/IItemResourceRequestOptions/#resource) request option. [`6555683`](https://github.com/Esri/arcgis-rest-js/commit/65556830e85401951efe4a10209004aed4301877) 🙏ssylvia🙏

## [1.11.1] - September 25th 2018

### @esri/arcgis-rest-request

- Bug Fixes
  - **item**: use fileName parameter to name Blobs when present [`106cc8a`](https://github.com/Esri/arcgis-rest-js/commit/106cc8a92389bfdd5af651d7aaf3cd327caf5f02)

### @esri/arcgis-rest-auth

- Bug Fixes
  - **:lock:**: `UserSession` now respects the `ssl` flag set for specific Organizations[`a350f76`](https://github.com/Esri/arcgis-rest-js/commit/a350f766dcd8e04d34b5c5cc662e16e38947e407)
  - **portal**: tokens are now fetched correctly for calls to ArcGIS Enterprise rest/admin/services [`9f5c093`](https://github.com/Esri/arcgis-rest-js/commit/79dda000e9cc3d8cf270ab3ace65d70d20d5ac57) 🙏dpbayer🙏

### Other Changes

- Documentation

  - added conceptual guides to explain when and how to use `UserSession` and `ApplicationSession`.

- Chores
  - **tsc**: upgrade typescript to v3.x.0 [`586983c`](https://github.com/Esri/arcgis-rest-js/commit/586983c447cc32a45507bf18314c06c9f1a8f37d) [#265](https://github.com/Esri/arcgis-rest-js/issues/265)
  - **api**: add cdn script tag to docs api page and package pages (#336) [`47bdb8d`](https://github.com/Esri/arcgis-rest-js/commit/47bdb8d7b5c6cb593686e01d4fbcb6bc1266d4e0)

## [1.11.0] - September 19th 2018

### @esri/arcgis-rest-request

- Bug Fixes

  - **item**: use fileName parameter to name Blobs when present [`9f5c093`](https://github.com/Esri/arcgis-rest-js/commit/9f5c09390696f7945d78b8f45b431d2705b53c16)
  - **request**: improve error message when FormData isnt available [`89ff196`](https://github.com/Esri/arcgis-rest-js/commit/89ff1969a7af41a2d2e6cf9d3a84849ef82168d6)

- Chores
  - **:nail_care:**: refactor geocoder, groups and users to make the code more legible (#336) [`174e6cd`](https://github.com/Esri/arcgis-rest-js/commit/174e6cd626b4429801e65fcbb6b8f1a72ed1d0e3)

## [1.10.0] - September 17th 2018

### @esri/arcgis-rest-feature-service-admin

- New Features
  - **users**: add `addToServiceDefinition()` function [`d3f2553`](https://github.com/Esri/arcgis-rest-js/commit/d3f2553e59235c7657a074160a3694e06144b87e)

### Other Changes

- Documentation
  - **api**: bad to good [`c846b65`](https://github.com/Esri/arcgis-rest-js/commit/c846b653b35d5a14f7d83cad522a8b1fdc2934c2)

## [1.9.0] - September 11th 2018

### @esri/arcgis-rest-feature-service-admin

- New Package!
  - with `createFeatureService()` method.

### @esri/arcgis-rest-common-types

- New Features
  - **users**: add getUserNotifications function [`9fbc5e2`](https://github.com/Esri/arcgis-rest-js/commit/9fbc5e2afe67be4ff4667af5a4e7cbea39ec5b08)

### @esri/arcgis-rest-feature-service

- Chores
  - **lint**: make sure _all_ the code is linted each commit [`0374759`](https://github.com/Esri/arcgis-rest-js/commit/03747597ea62962c7411a13be70a25873243be58) [#301](https://github.com/Esri/arcgis-rest-js/issues/301)

### @esri/arcgis-rest-groups

- New Features
  - **groups**: add createGroupNotification [`4baab64`](https://github.com/Esri/arcgis-rest-js/commit/4baab6495d8ae394061bd74052b00b2356a0eb4d)

### @esri/arcgis-rest-request

- Bug Fixes
  - **check-for-errors**: throw an error for a response with a \`failure\` status [`9ee1c0c`](https://github.com/Esri/arcgis-rest-js/commit/9ee1c0c181ab921fbf67fefe8b8e5e525749fed7)
  - **ArcGISRequestError**: replace null or empty messages and codes with UNKNOWN_ERROR and UNKNOWN_ERR [`bcea1da`](https://github.com/Esri/arcgis-rest-js/commit/bcea1dadc94925b4d9c13fe1d297a834107064a2)

### @esri/arcgis-rest-sharing

- Bug Fixes
  - **sharing**: rework group membership checking, fix UserSession.getUser scope issue [`909a37e`](https://github.com/Esri/arcgis-rest-js/commit/909a37ec2f928ad223c674ae0d4033e24761ae9a)

### @esri/arcgis-rest-users

- New Features
  - **users**: add getUserNotifications function [`9fbc5e2`](https://github.com/Esri/arcgis-rest-js/commit/9fbc5e2afe67be4ff4667af5a4e7cbea39ec5b08)
  - **users**: adds removeNotification function [`b4a55d0`](https://github.com/Esri/arcgis-rest-js/commit/b4a55d0b336d0bec2cbf4b10a059894d8589efba)

### Other Changes

- Chores
  - **lint**: make sure _all_ the code is linted each commit [`0dc4531`](https://github.com/Esri/arcgis-rest-js/commit/0dc4531114ad0474aaf26e925d0e1974ed81912d)
- Documentation
  - **api**: ensure example code appears in docs for addFeatures [`af61e3e`](https://github.com/Esri/arcgis-rest-js/commit/af61e3e9b2a7fbc164b1d3e7ccad8e9b6a2079ea)
- New Features
  - **users**: add getUserNotifications function [`40bc5c1`](https://github.com/Esri/arcgis-rest-js/commit/40bc5c1e0c760107a7f7f38d1115a6105eef5528)
  - **groups**: add createGroupNotification [`6a17fe5`](https://github.com/Esri/arcgis-rest-js/commit/6a17fe577b6c6f839d2667fd6d14099ab41f3bab)

## [1.8.0] - August 17th 2018

### @esri/arcgis-rest-items

- Chores
  - **items**: break out item methods into individual files [`be17cab`](https://github.com/Esri/arcgis-rest-js/commit/be17cab0f5801858e3dc8b7455a0f0cf98e577f5)
- New Features
  - **resources**: new method to add a new resource to an item [`9c63075`](https://github.com/Esri/arcgis-rest-js/commit/9c63075e9f202a13632e34e2a478a9de70b6fafb) [#281](https://github.com/Esri/arcgis-rest-js/issues/281)
- Bug Fixes
  - **search**: ensure searchItems can mixin arbitrary parameters with a searchform [`a26b935`](https://github.com/Esri/arcgis-rest-js/commit/a26b9354a35b11014eda23dacccbf53210606e7e)

### Other Changes

- Chores
  - **publish**: check for npm login before allowing publish [`7b13a1a`](https://github.com/Esri/arcgis-rest-js/commit/7b13a1a2b5d4153e56bec347cf2a903a826251a7)
  - **doc**: misc doc fixes 🙏gavinr🙏

## [1.7.1] - August 10th 2018

### @esri/arcgis-rest-auth

- Bug Fixes
  - **sharing**: ensure internal sharing metadata calls pass through custom request options [`e70a10d`](https://github.com/Esri/arcgis-rest-js/commit/e70a10d5bbd6ac4fecf61f9f635b01cf9c8c5034) [#276](https://github.com/Esri/arcgis-rest-js/issues/276)

### @esri/arcgis-rest-items

- Tests
  - **items**: test body of addItemData request in browser tests [`2710f4c`](https://github.com/Esri/arcgis-rest-js/commit/2710f4c281f3e04b00b9ad2da73ca4e35f9dfcb3)

### @esri/arcgis-rest-request

- Bug Fixes
  - **encodeFormData**: append file name based on object type instead of key and name properties [`401c6dd`](https://github.com/Esri/arcgis-rest-js/commit/401c6dd205c1e2470783435d0da22338edbcaed4)

### @esri/arcgis-rest-sharing

- Bug Fixes
  - **sharing**: ensure internal sharing metadata calls pass through custom request options [`e70a10d`](https://github.com/Esri/arcgis-rest-js/commit/e70a10d5bbd6ac4fecf61f9f635b01cf9c8c5034) [#276](https://github.com/Esri/arcgis-rest-js/issues/276)

### Other Changes

- Bug Fixes
  - **sharing**: ensure internal sharing metadata calls pass through cus… [`c09548c`](https://github.com/Esri/arcgis-rest-js/commit/c09548c866d11a6c7c693bf948e8f1889b7893a8)

## [1.7.0] - August 7th 2018

- Chores
  - **all**: more legible, terse copyright notices in built packages.

### @esri/arcgis-rest-request

- Bug Fixes
  - avoid `new Header()` when POSTing to ensure that the library is able to utilize custom fetch implementations correctly.

### @esri/arcgis-rest-auth

- Bug Fixes
  - the `getToken()` method of both `UserSession` and `ApplicationSession` now expose a `requestOptions?` parameter so that a custom fetch implementation can be passed through.

### @esri/arcgis-rest-feature-service

- Features
  - new `queryRelated()` method for querying the related records associated with a feature service 🙏mpayson🙏

## [1.6.0] - July 27th 2018

### @esri/arcgis-rest-auth

- Chores

  - **all**: get pkg.versions back in sync [`c7751c8`](https://github.com/Esri/arcgis-rest-js/commit/c7751c866bb500833fcd3506f6de7a60928a35fa)

- Bug Fixes
  - ensure tokens can be generated successfully for hosted feature services.

### @esri/arcgis-rest-common-types

- Chores
  - **groups**: remove duplicate IGroup interface and corrections to IItem interface) [`dd10d72`](https://github.com/Esri/arcgis-rest-js/commit/dd10d722efac1b2b2c70c84ebbd0468854f88e33) [#241](https://github.com/Esri/arcgis-rest-js/issues/241)

### @esri/arcgis-rest-feature-service

- Features
  - new methods for querying, adding, updating and deleting feature service attachments 🙏COV-GIS🙏
  - new feature service attachement demo! 🙏COV-GIS🙏
  - **query features**: add count and extent to IQueryFeaturesResponse [`2ab9f33`](https://github.com/Esri/arcgis-rest-js/commit/2ab9f339f746e79beb06301e2c5e967d8c5135a2)

### @esri/arcgis-rest-groups

- Chores
  - **groups**: remove duplicate IGroup interface (and extend IItem) [`dd10d72`](https://github.com/Esri/arcgis-rest-js/commit/dd10d722efac1b2b2c70c84ebbd0468854f88e33) [#241](https://github.com/Esri/arcgis-rest-js/issues/241)

### @esri/arcgis-rest-items

- Features
  - **data**: added support for fetching and uploading binary data associated with items 🙏MikeTschudi🙏
- Bug Fixes
  - **crud**: enforce more AGOL rules in item crud operations [`3f365d9`](https://github.com/Esri/arcgis-rest-js/commit/3f365d9b0847a7cacd46d7b4c1a34b5dda235f7b) [#246](https://github.com/Esri/arcgis-rest-js/issues/246)
- Chores
  - more consistent `owner` checks across item methods

### @esri/arcgis-rest-request

- Chores
  - **all**: get pkg.versions back in sync [`c7751c8`](https://github.com/Esri/arcgis-rest-js/commit/c7751c866bb500833fcd3506f6de7a60928a35fa)

### Other Changes

- Documentation
  - **api**: add toggle component for side nav on API page. [`1432c22`](https://github.com/Esri/arcgis-rest-js/commit/1432c228c8c3816e3a41f605eb276bceb8920075)
  - **api**: fix api nav toggle url path check so it works in production [`90db4a0`](https://github.com/Esri/arcgis-rest-js/commit/90db4a00700c00e3048d887176e8ecd32a66909c)

## [1.5.1] - July 12th 2018

### @esri/arcgis-rest-users

- Bug Fixes
  - **users**: users defaults to https://www.arcgis.com instead of http:// [`7e3d9f6`](https://github.com/Esri/arcgis-rest-js/commit/7e3d9f621ced27e3a64778ebbebff40fcc93d994)

### Other Changes

- Bug Fixes
  - **users**: users defaults to https://www.arcgis.com instead of http:// [`d92e053`](https://github.com/Esri/arcgis-rest-js/commit/d92e05364e78ae21c3bb4adbeb725ba89503d966)

## [1.5.0] - July 10th 2018

### @esri/arcgis-rest-auth

- New Features

  - **auth** add support for an OAuth flow that triggers social media login automatically [`2e582e1`](https://github.com/Esri/arcgis-rest-js/commit/2e582e12fc3e5bf9688b3ba80da33e4a5a5fa84f)

- Bug Fixes
  - **enterprise**: fetch fresh token manually when u/pw are provided [`299f3c0`](https://github.com/Esri/arcgis-rest-js/commit/299f3c0da043b74113310cba9a3e9a0f77afa921) [#161](https://github.com/Esri/arcgis-rest-js/issues/161)

### Other Changes

- Bug Fixes
  - **enterprise**: ensure a brand new token can be generated for servers federated with ArcGIS Enterprise [`ddd3d57`](https://github.com/Esri/arcgis-rest-js/commit/ddd3d57bb8a98f79c0fb0de6507d5e9483ab91ec)

## [1.4.2] - July 8th 2018

- Bug Fixes:
  - removed corrupt artifacts shipped with previous release
  - **crud**: ensure add/update/deleteFeatures dont pass extraneous parameters [`8566860`](https://github.com/Esri/arcgis-rest-js/commit/8566860554beb32e87c4b9b28b40138b7ac70b80) [#223](https://github.com/Esri/arcgis-rest-js/pull/238/)
  - **auth** fixed typo in peerDependency name [`d0d89b8`](https://github.com/Esri/arcgis-rest-js/commit/d0d89b875e4887c327f4501aaa47ac9f339a6c6b) 🙏richardhinkamp🙏 [#237](https://github.com/Esri/arcgis-rest-js/pull/237/)

## [1.4.1] - June 20th 2018

### @esri/arcgis-rest-auth

- New Features
  - **auth**: add toCredential() method to UserSession to pass to jsapi [`c03430d`](https://github.com/Esri/arcgis-rest-js/commit/c03430d4d5b93d983c9cab39117a5623113425e8) [#208](https://github.com/Esri/arcgis-rest-js/issues/208)
  - **auth**: add fromCredential() to instantiate UserSession _from_ jsapi auth [`ea64da9`](https://github.com/Esri/arcgis-rest-js/commit/ea64da92c74c3a9b6671e66872070372db46cd72) [#208](https://github.com/Esri/arcgis-rest-js/issues/208)
- Bug Fixes
  - **auth**: use www.arcgis.com consistently [`a7dc28d`](https://github.com/Esri/arcgis-rest-js/commit/a7dc28d9fe860f380ed57137bcafe73ab0bb5e9d) [#223](https://github.com/Esri/arcgis-rest-js/issues/223)

### @esri/arcgis-rest-feature-service

- Misc.
  - **feature-service**: refactor feature service signatures to stop leaning on params directly [`410a511`](https://github.com/Esri/arcgis-rest-js/commit/410a511b2992f5d3daffeef7937a8b270e119bf9)

### @esri/arcgis-rest-geocoder

- Misc.
  - **reorganizing**: break up geocoding package into multiple files [`216f23c`](https://github.com/Esri/arcgis-rest-js/commit/216f23cbc21803c22db6a737b48f97507fe6bc0b) [#216](https://github.com/Esri/arcgis-rest-js/issues/216)

### Other Changes

- Documentation
  - **demos**: jsapi integration demo shows more typical scenario [`0878793`](https://github.com/Esri/arcgis-rest-js/commit/0878793cf3d2cdd05f7cdc39ede9802a415f8f85)
- Misc.
  - **feature-service**: update signatures [`c0a881b`](https://github.com/Esri/arcgis-rest-js/commit/c0a881bd028eb189ca27fa666ae1089663a563c1)

## [1.4.0] - June 6th 2018

### @esri/arcgis-rest-auth

- New Features
  - **caring**: methods to un/share items with groups [`8572bb0`](https://github.com/Esri/arcgis-rest-js/commit/8572bb0ab0222e4f0eedbe9cfd4ff00c160f0c77)

### @esri/arcgis-rest-demo-express

- Chores
  - **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-demo-vanilla

- Chores
  - **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-demo-vue-with-popup

- Chores
  - **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-geocoder-vanilla

- Chores
  - **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### @esri/arcgis-rest-sharing

- New Features
  - **caring**: new sharing package with method to set access on items [`a212d59`](https://github.com/Esri/arcgis-rest-js/commit/a212d59abf820f2e719aaaedb85dd3f3708dc793) [#43](https://github.com/Esri/arcgis-rest-js/issues/43)
  - **caring**: methods to un/share items with groups [`8572bb0`](https://github.com/Esri/arcgis-rest-js/commit/8572bb0ab0222e4f0eedbe9cfd4ff00c160f0c77)

### Other Changes

- Chores
  - **tooling**: bump commitizen to allow empty commits [`b4f254c`](https://github.com/Esri/arcgis-rest-js/commit/b4f254cd6eaa8e456ca23524f746eeb925ec534c)

### batch-geocoder

- Chores
  - **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### feature-service-browser

- Chores
  - **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

### node-cli

- Chores
  - **tooling**: bump commitizen to allow empty commits [`746a6c5`](https://github.com/Esri/arcgis-rest-js/commit/746a6c57d7d9bd12fd7b8a101d8c17e878999b6f) [#188](https://github.com/Esri/arcgis-rest-js/issues/188)

## [1.3.0] - May 23rd 2018

### @esri/arcgis-rest-items

- Bug Fixes
  - Better handling of missing tags [`c7ba459`](https://github.com/Esri/arcgis-rest-js/commit/c7ba459a1e455132e3d494d6679c835eebdcef90) 🙏alukach🙏

### @esri/arcgis-rest-common-types

- New Features
  - Loads of new Webmap typings! [`e52f115`](https://github.com/Esri/arcgis-rest-js/commit/e52f11506f087d29ad59e302e95e055d73cb1c9c) 🙏JeffJacobson🙏

### @esri/arcgis-rest-feature-service

- Documentation
  - **feature-service**: add missing `@params` [`b0d96f1`](https://github.com/Esri/arcgis-rest-js/commit/b0d96f118211edbabac08669260235b71ee96fec)

### @esri/arcgis-rest-request

- Chores
  - **404**: new bit.ly link in err message [`4976a2c`](https://github.com/Esri/arcgis-rest-js/commit/4976a2c83863d98ec40b3991e2ab14263529ac8e)

### Other Changes

- Misc.
  - **arcgis-rest-common-types**: simplified build [`11ae59c`](https://github.com/Esri/arcgis-rest-js/commit/11ae59c1a78835fea91430da9ef860c60225ee7e)
- Chores
  - **404**: new bit.ly link in err message [`e406915`](https://github.com/Esri/arcgis-rest-js/commit/e4069159abc7c58727ef811d32ec825ce7349306)
- Documentation
  - **feature-service**: add missing `@params` [`80faae8`](https://github.com/Esri/arcgis-rest-js/commit/80faae8b681d338823db70a70da61e0e46fa87fa)
- New Features
  - **common-types**: Added webmap interfaces and types [`e52f115`](https://github.com/Esri/arcgis-rest-js/commit/e52f11506f087d29ad59e302e95e055d73cb1c9c)

## [1.2.1] - May 15th 2018

### Other Changes

- Bug Fixes
  - **umd**: strip outdated umd files from npm packages [`2e1764d`](https://github.com/Esri/arcgis-rest-js/commit/2e1764ddfc4c43956d94d440412464d10cd4aea5) [#198](https://github.com/Esri/arcgis-rest-js/issues/198)

## [1.2.0] - May 14th 2018

### @esri/arcgis-rest-auth

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
- Bug Fixes
  - **oAuth**: fix oAuth2 methods in IE 11 and Edge [`462f980`](https://github.com/Esri/arcgis-rest-js/commit/462f980082f9eeb8c55b5aa6c5981422ae40105f)

### @esri/arcgis-rest-common-types

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
- Bug Fixes
  - **IItem**: make all IItem properties optional [`8df9278`](https://github.com/Esri/arcgis-rest-js/commit/8df9278a5c59f6e85384dd106f0d379c847f72c1) [#171](https://github.com/Esri/arcgis-rest-js/issues/171)

### @esri/arcgis-rest-feature-service

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
- Documentation
  - **snippets**: add CRUD feature service snippets and fix geocoder ones [`7143f06`](https://github.com/Esri/arcgis-rest-js/commit/7143f0625c6c3c0cc21a1451ffa76a35ddba60f1) [#190](https://github.com/Esri/arcgis-rest-js/issues/190)
- New Features
  - **feature-service**: add feature service CRUD methods [`5cb8fbc`](https://github.com/Esri/arcgis-rest-js/commit/5cb8fbcb0ff4bbb314b9926511c4502d0f4737b0) [#176](https://github.com/Esri/arcgis-rest-js/issues/176)

### @esri/arcgis-rest-geocoder

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
- Documentation
  - **snippets**: add CRUD feature service snippets and fix geocoder ones [`7143f06`](https://github.com/Esri/arcgis-rest-js/commit/7143f0625c6c3c0cc21a1451ffa76a35ddba60f1) [#190](https://github.com/Esri/arcgis-rest-js/issues/190)
- Bug Fixes
  - **geocode**: max sure user supplied request options are all passed through [`3ffa710`](https://github.com/Esri/arcgis-rest-js/commit/3ffa7107bcf4d6ee4cf735bb0a14eac638e93a6c)

### @esri/arcgis-rest-groups

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)

### @esri/arcgis-rest-items

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
- Bug Fixes
  - **createItem**: owner `item.owner` authentication.username [`76680a1`](https://github.com/Esri/arcgis-rest-js/commit/76680a1834332a196bf4b93a05caf5020156fe0f)
  - **itemSearch**: max sure user supplied request options are all passed through [`afb9e38`](https://github.com/Esri/arcgis-rest-js/commit/afb9e38e7cf83571a5d998b3eb97678c2e730524) [#183](https://github.com/Esri/arcgis-rest-js/issues/183)

### @esri/arcgis-rest-request

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)
- Bug Fixes
  - **fetch**: set credentials: same-origin in fetch options to support sending IWA cookies [`a4d0115`](https://github.com/Esri/arcgis-rest-js/commit/a4d0115522c1d2a3e44e15320c84745ad58389dc)

### @esri/arcgis-rest-users

- Chores
  - **umd**: make umd filenames more terse [`368e1a1`](https://github.com/Esri/arcgis-rest-js/commit/368e1a19088d4eff55144e71b9e0285c92a32199)

### Other Changes

- Chores
  - **copyright**: remove duplicate copyright statements from minified files [`13b5db5`](https://github.com/Esri/arcgis-rest-js/commit/13b5db52d96f62787aae0b3a9c9558864831f671)
- Documentation
  - **snippets**: add CRUD feature service snippets and fix geocoder ones [`26da42e`](https://github.com/Esri/arcgis-rest-js/commit/26da42e25fd55a2dc6c4a380cc6257e29e6a7d3f)
- Bug Fixes
  - **oauth-demo**: remove ES2015 buts from oAuth Demo for IE 11 [`22ec948`](https://github.com/Esri/arcgis-rest-js/commit/22ec94889d5867c07babaf2c85197f39c0ae46f1)
  - **IItem**: make id and owner the only required properties of IItem [`9c508f2`](https://github.com/Esri/arcgis-rest-js/commit/9c508f25a2404f0cbea8d22da98653a875a49901)
  - **fetch**: set credentials: same-origin in fetch options [`3ae7159`](https://github.com/Esri/arcgis-rest-js/commit/3ae715939fd3245a8dc0f693e82a7df16fe099a1)

### doc improvements

- Bug Fixes
  - **createItem**: owner item.owner authentication.username [`76680a1`](https://github.com/Esri/arcgis-rest-js/commit/76680a1834332a196bf4b93a05caf5020156fe0f)

## [1.1.2] - May 2nd 2018

### @esri/arcgis-rest-auth

- Chores
  - **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
  - **security**: bump devDependencies to resolve security vulnerability [`16fd1a7`](https://github.com/Esri/arcgis-rest-js/commit/16fd1a7915ebd2dbed1c25ec5ce99875505106cc)
- Documentation
  - **LICENSE**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
- Bug Fixes
  - **auth**: allow trailing slash in portal URL [`b76da90`](https://github.com/Esri/arcgis-rest-js/commit/b76da902d67d4ac3635ac18eb780e7c68d7617f7)
  - **auth**: decode username when parsing response from OAuth [`e0c2a44`](https://github.com/Esri/arcgis-rest-js/commit/e0c2a44bd5032ce9b45b0f8511e9cc256056872c) [#165](https://github.com/Esri/arcgis-rest-js/issues/165)
  - **OAuth2 options**: added locale and state parameters for browser based OAuth2 [`b05996e`](https://github.com/Esri/arcgis-rest-js/commit/b05996e83b1836f9a27337939a9a681d41207504)

### @esri/arcgis-rest-common-types

- Chores
  - **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
- Documentation
  - **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
- New Features
  - **new users package**: added rest-users with a single method [`a24ed0b`](https://github.com/Esri/arcgis-rest-js/commit/a24ed0b78d5d044089aed104e5ba38c25fff69a6) [#159](https://github.com/Esri/arcgis-rest-js/issues/159)

### @esri/arcgis-rest-demo-vue-with-popup

- Chores
  - **security**: bump devDependencies to resolve security vulnerability [`16fd1a7`](https://github.com/Esri/arcgis-rest-js/commit/16fd1a7915ebd2dbed1c25ec5ce99875505106cc)

### @esri/arcgis-rest-feature-service

- Chores
  - **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
- Documentation
  - **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-geocoder

- Chores
  - **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
- Documentation
  - **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-groups

- Chores
  - **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
- Documentation
  - **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-items

- Chores
  - **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
- Documentation
  - **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)

### @esri/arcgis-rest-request

- Chores
  - **all READMEs**: add links to API reference sections [`3afbe95`](https://github.com/Esri/arcgis-rest-js/commit/3afbe95de00abd313f808808236f3a534dea4e84) [#148](https://github.com/Esri/arcgis-rest-js/issues/148)
- Documentation
  - **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
- Bug Fixes
  - **getPortalUrl**: make getPortalUrl use portal in request options if passed in [`6103101`](https://github.com/Esri/arcgis-rest-js/commit/61031012d249fcaa9d86b5c68c9cbe7489b7a3b5) [#180](https://github.com/Esri/arcgis-rest-js/issues/180)

### @esri/arcgis-rest-users

- Documentation
  - **LICENSe**: fix license links in package READMEs [`d9f6027`](https://github.com/Esri/arcgis-rest-js/commit/d9f6027fd82317392a4df1b955226c68bfc6eaf7)
- New Features
  - **new users package**: added rest-users with a single method [`a24ed0b`](https://github.com/Esri/arcgis-rest-js/commit/a24ed0b78d5d044089aed104e5ba38c25fff69a6) [#159](https://github.com/Esri/arcgis-rest-js/issues/159)

### Other Changes

- Chores
  - **batch-geocoder**: make sure sample data is include in repo [`7df7b54`](https://github.com/Esri/arcgis-rest-js/commit/7df7b548c6564dc2b77b9d228af83649b14a0d80)
  - **all READMEs**: add links to API reference sections [`ab546e0`](https://github.com/Esri/arcgis-rest-js/commit/ab546e0e9d0276539ea5a7f24cace9f97bc9dac8)
  - **CONTRIBUTING**: add info about commitizen (#167) [`9477de1`](https://github.com/Esri/arcgis-rest-js/commit/9477de1e7eb7e921ab30b6e618b4bcddc641d06d) [#147](https://github.com/Esri/arcgis-rest-js/issues/147) [#167](https://github.com/Esri/arcgis-rest-js/issues/167)
- Documentation
  - **changelog**: fix comparison links and use todays date for each release [`27c9f33`](https://github.com/Esri/arcgis-rest-js/commit/27c9f337a9511f3b6fd39f236a04eacedb76eff6) [#149](https://github.com/Esri/arcgis-rest-js/issues/149)
  - **changelog**: fix comparison links and use todays date for each re… [`29e879d`](https://github.com/Esri/arcgis-rest-js/commit/29e879d27ec322680457b06f0c5155cd6b48e93e)
  - **LICENSE**: fix license links in package READMEs [`00d7e8c`](https://github.com/Esri/arcgis-rest-js/commit/00d7e8cf381edc669c4b5fe92e5b21961479dc9e)
- New Features
  - **new users package**: add rest-users with a single method [`29b7af0`](https://github.com/Esri/arcgis-rest-js/commit/29b7af087c366fe377345d015ff8c3910f969c2c)
- Bug Fixes
  - **auth**: decode username when parsing response from OAuth [`fd9005f`](https://github.com/Esri/arcgis-rest-js/commit/fd9005fef74c33c684273fd283aa6bd9990e8630)
  - **OAuth2 options**: add locale and state parameters for browser based OAuth2 [`6234f0c`](https://github.com/Esri/arcgis-rest-js/commit/6234f0c9cc40a73a0e6e05080abef48bc8b15b2b)

### batch-geocoder

- Chores
  - **batch-geocoder**: make sure sample data is include in repo [`9b4d6b5`](https://github.com/Esri/arcgis-rest-js/commit/9b4d6b5420c9e3be846e93661f433e76a0ed6882)

### use clientId for state by default

- Bug Fixes
  - **OAuth2 options**: added locale and state parameters for browser based OAuth2 [`b05996e`](https://github.com/Esri/arcgis-rest-js/commit/b05996e83b1836f9a27337939a9a681d41207504)

## [1.1.1] - March 5th 2018

### @esri/arcgis-rest-common-types

- Bug Fixes
  - **common-types**: ensure typings are distributed in common-types npm package [`bec3fbf`](https://github.com/Esri/arcgis-rest-js/commit/bec3fbfeac304a12be419c4bf560ace800f99c56) [#151](https://github.com/Esri/arcgis-rest-js/issues/151)

### @esri/arcgis-rest-demo-vanilla

- Bug Fixes
  - **common-types**: ensure typings are distributed in common-types npm package [`bec3fbf`](https://github.com/Esri/arcgis-rest-js/commit/bec3fbfeac304a12be419c4bf560ace800f99c56) [#151](https://github.com/Esri/arcgis-rest-js/issues/151)

### @esri/arcgis-rest-request

- Bug Fixes
  - **request**: ensure request is passed through as a request parameter [`77ad553`](https://github.com/Esri/arcgis-rest-js/commit/77ad5533b273c60cb4c6078ecf8fc05249214c19) [#142](https://github.com/Esri/arcgis-rest-js/issues/142)

### Other Changes

- Bug Fixes
  - **common-types**: ensure typings are distributed in common-types npm… [`3dfed70`](https://github.com/Esri/arcgis-rest-js/commit/3dfed705ea935ff06aec598f0a56b767febace6c)
  - **request**: ensure request is passed through as a request parameter [`43936f7`](https://github.com/Esri/arcgis-rest-js/commit/43936f7d9609c5e87224873ddcfaf0efff693492)

## [1.1.0] - March 3rd 2018

### @esri/arcgis-rest-auth

- Chores
  - **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
- New Features
  - **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
- Bug Fixes
  - **auth**: better regex match for usernames [`d38a7fb`](https://github.com/Esri/arcgis-rest-js/commit/d38a7fb0e1bff3c49a135bc10be74893ec60a1e9)
  - **build**: set other @esri/arcgis-rest-js-\* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-common-types

- Chores
  - **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
- New Features
  - **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
  - **lots more common-types**: adding a lot more common data types [`73ce0b8`](https://github.com/Esri/arcgis-rest-js/commit/73ce0b8ff4780fa925814f9bf279c74a513fc0ad)
- Bug Fixes
  - **build**: set other @esri/arcgis-rest-js-\* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-feature-service

- Chores
  - **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
- New Features

  - **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
  - **feature service**: New arcgis-rest-feature-serivce package w/ `getFeature()` to get a feature by id [`1d0e57e`](https://github.com/Esri/arcgis-rest-js/pull/115/commits/1d0e57eadf283ec37887f097201029196f2ba348)
  - **feature service**: add queryFeatures() to send query requests to feature services [#126](https://github.com/Esri/arcgis-rest-js/pull/126)

- Bug Fixes
  - **build**: set other @esri/arcgis-rest-js-\* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-geocoder

- Chores
  - **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
- New Features
  - **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
  - **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
- Bug Fixes
  - **build**: set other @esri/arcgis-rest-js-\* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)
- Misc.
  - **geocoder**: rename IGeocodeServiceInfoResponse to IGetGeocodeServiceResponse [`2586de1`](https://github.com/Esri/arcgis-rest-js/commit/2586de1cf6d4ef4b3f31fe5acb9b5ab2f949e9b8)
  - **geocoder**: use a more descriptive method to fetch metadata [`c774937`](https://github.com/Esri/arcgis-rest-js/commit/c774937ac6a9dc21066a2a46d01b99240e551b76) [#122](https://github.com/Esri/arcgis-rest-js/issues/122)

### @esri/arcgis-rest-groups

- Chores
  - **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
- New Features
  - **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
  - **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
- Bug Fixes
  - **build**: set other @esri/arcgis-rest-js-\* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-items

- Chores
  - **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
- New Features
  - **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
  - **common-types**: add more common types, keep the I in front of interfaces [`d91dd0e`](https://github.com/Esri/arcgis-rest-js/commit/d91dd0e127f70804beec8a4ce373c17755746c2e)
- Bug Fixes
  - **build**: set other @esri/arcgis-rest-js-\* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)

### @esri/arcgis-rest-request

- Chores
  - **npm packages**: remove test files and tsconfig.json from npm tarballs [`37940e7`](https://github.com/Esri/arcgis-rest-js/commit/37940e7268e0d4ea8628d23c3b26e3d4ab22877a) [#132](https://github.com/Esri/arcgis-rest-js/issues/132)
- New Features
  - **all packages**: start shipping an unminified UMD for each package [`52043f5`](https://github.com/Esri/arcgis-rest-js/commit/52043f5b702aca699f62abf8054582286e258ba5) [#135](https://github.com/Esri/arcgis-rest-js/issues/135)
  - **request**: let consumers specify GET w/ max URL length; if exceeded, use POST [`6b9f658`](https://github.com/Esri/arcgis-rest-js/pull/127/commits/6b9f6584c73b3d7db7734f48e93355de72b7c9d8)
- Bug Fixes
  - **request**: ensure falsy request parameters are passed through [`3c69a10`](https://github.com/Esri/arcgis-rest-js/commit/3c69a103c04c089a876b03cc88179caa5fb4e705) [#142](https://github.com/Esri/arcgis-rest-js/issues/142)
  - **request**: HTTP errors throw ArcGISRestError before parsing response [`c86b07d`](https://github.com/Esri/arcgis-rest-js/pull/131/commits/c86b07d6fb4b89f6469ee052f35ee23a2e3d4915)
  - **build**: set other @esri/arcgis-rest-js-\* pacakges as external [`2f77c9f`](https://github.com/Esri/arcgis-rest-js/commit/2f77c9f11c2e8a9e85291f844aea9bdc730cdde3) [#128](https://github.com/Esri/arcgis-rest-js/issues/128)
- Misc.
  - **geocoder**: use a more descriptive method to fetch metadata [`c774937`](https://github.com/Esri/arcgis-rest-js/commit/c774937ac6a9dc21066a2a46d01b99240e551b76) [#122](https://github.com/Esri/arcgis-rest-js/issues/122)

### Other Changes

- Chores
  - **rollup**: bump to the latest version of rollup [`f4411c3`](https://github.com/Esri/arcgis-rest-js/commit/f4411c33c62adb83e46253b7b029c13155009df8)
  - **rollup**: bump to the latest version of rollup [`b22a262`](https://github.com/Esri/arcgis-rest-js/commit/b22a2626b68e0a805ac013adb8b776f9fd72f8a1) [#136](https://github.com/Esri/arcgis-rest-js/issues/136)
  - **npm packages**: remove test files and tsconfig.json from npm tar… [`232b863`](https://github.com/Esri/arcgis-rest-js/commit/232b863aae45ea3ad1f85b8c027ade8976e090e9)
  - **changelog**: prevent changelog.js from looking beyond newline for closed issues [`a2b6996`](https://github.com/Esri/arcgis-rest-js/commit/a2b6996dfc9545808aacf3302250e3c8a3cc3038)
  - **changelog**: prevent changelog.js from looking beyond newline for closed issues [`8b21d67`](https://github.com/Esri/arcgis-rest-js/commit/8b21d6717071256418f5b633e17283335a88c543)
- Documentation
  - **getting started**: rearranged getting started doc and fixed a cou… [`361210c`](https://github.com/Esri/arcgis-rest-js/commit/361210c20573d25d1eb6227195c81cd1750a26b8)
  - **getting started**: rearranged getting started doc and fixed a couple typos [`3d5b371`](https://github.com/Esri/arcgis-rest-js/commit/3d5b371f54fa6fef9cc07aba6d19367e4777b0da)
- Bug Fixes
  - **auth**: better regex match for usernames [`04ec689`](https://github.com/Esri/arcgis-rest-js/commit/04ec689cc5a0294d24c85373cb708e7d40534a4d)
  - **request**: ensure falsy request parameters like zero are passed through [`d657b57`](https://github.com/Esri/arcgis-rest-js/commit/d657b57fdf4540ac61cfa0dac5f793fe9dc1fbe6)
- Misc.
  - **geocoder**: use a more descriptive method to fetch metadata [`4b1544f`](https://github.com/Esri/arcgis-rest-js/commit/4b1544f8b788573137d3519718ab1869eefd17a2)

### batch-geocoder

- Breaking Changes
  - **lots more common-types**: adding a lot more common data types [`73ce0b8`](https://github.com/Esri/arcgis-rest-js/commit/73ce0b8ff4780fa925814f9bf279c74a513fc0ad)

## [1.0.3] - December 21st 2017

### @esri/arcgis-rest-auth

- Documentation
  - **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
- Bug Fixes
  - **UserSession**: throw ArcGISAuthError instead of Error when unable to refresh a token [`8854765`](https://github.com/Esri/arcgis-rest-js/commit/88547656ce88786e2dcac8e8e0e78045b67e8e16) [#56](https://github.com/Esri/arcgis-rest-js/issues/56)
  - **oauth**: check for window parent correctly in ouath without popup [`a27bb7d`](https://github.com/Esri/arcgis-rest-js/commit/a27bb7da5fa5de7ddfbc2d676b707bfa1780ecbf)
- Misc.
  - **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-common-types

- Documentation
  - **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)

### @esri/arcgis-rest-demo-vanilla

- Documentation
  - **batch geocoder**: add new demo to batch geocode addresses from csv in node [`152c9d8`](https://github.com/Esri/arcgis-rest-js/commit/152c9d88663555d3b05a38f374114bf8ddd18394) [#97](https://github.com/Esri/arcgis-rest-js/issues/97)

### @esri/arcgis-rest-geocoder

- Documentation
  - **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
- Misc.
  - **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-geocoder-vanilla

- Documentation
  - **batch geocoder**: add new demo to batch geocode addresses from csv in node [`152c9d8`](https://github.com/Esri/arcgis-rest-js/commit/152c9d88663555d3b05a38f374114bf8ddd18394) [#97](https://github.com/Esri/arcgis-rest-js/issues/97)

### @esri/arcgis-rest-groups

- Documentation
  - **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
- Misc.
  - **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-items

- Documentation
  - **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
- Bug Fixes
  - **items**: dont override user supplied parameters when updating items [`eaa1656`](https://github.com/Esri/arcgis-rest-js/commit/eaa1656fc0164098e45897ccd1bc9b21a865d2df) [#117](https://github.com/Esri/arcgis-rest-js/issues/117)
  - **params**: flip param values in updateItemResource so they are passed correctly [`5093e39`](https://github.com/Esri/arcgis-rest-js/commit/5093e390f5f60f5ca39901c361c4c993f1355d73) [#118](https://github.com/Esri/arcgis-rest-js/issues/118)
- Misc.
  - **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### @esri/arcgis-rest-request

- Documentation
  - **fix dead links**: fixed broken links within declaration page content [`449183b`](https://github.com/Esri/arcgis-rest-js/commit/449183b4bd612712be9cd8dca096c7514764cbcb)
- Bug Fixes
  - **request**: allow options.fetch without global fetch [`99cf01c`](https://github.com/Esri/arcgis-rest-js/commit/99cf01c391cffc4ba73f39119db05564962abd74) [#108](https://github.com/Esri/arcgis-rest-js/issues/108)
- Misc.
  - **package.json files and rollup config**: ensure JS build tools can fetch a valid UMD file [`29e0189`](https://github.com/Esri/arcgis-rest-js/commit/29e01897e35c6c4bb02709998afe2c493401d86d) [#101](https://github.com/Esri/arcgis-rest-js/issues/101)

### Other Changes

- Chores
  - **commit-script**: remove \`git add all\` from \`npm run c\` [`8d7f7ef`](https://github.com/Esri/arcgis-rest-js/commit/8d7f7ef4f4705738eddc5de74d92cc4f60462037)
  - **prettier**: ignore package.json and package-lock.json [`57d234e`](https://github.com/Esri/arcgis-rest-js/commit/57d234ee0bb20f336803cb1af7df026043ad81ed)
- Documentation
  - **links**: fix remaining 404s in docs [`ae59cd9`](https://github.com/Esri/arcgis-rest-js/commit/ae59cd9a3b7ac4c5895a638740708b76a9c87a50)
  - **links**: fix remaining 404s in docs [`3c9a0f0`](https://github.com/Esri/arcgis-rest-js/commit/3c9a0f074215d6f81f03a470c19ef3cff29ee62b) [#92](https://github.com/Esri/arcgis-rest-js/issues/92)
  - **api-ref**: remove function names from types that are functions [`65ca31b`](https://github.com/Esri/arcgis-rest-js/commit/65ca31be92648ae5b26437c40d50543642dcb757)
  - **api-ref**: add support for type children and index signatures as type values [`f88c259`](https://github.com/Esri/arcgis-rest-js/commit/f88c2598a6b786838a8d8b27ac7b58d229f3dbc8)
  - **api-ref**: support rendering array types [`264a123`](https://github.com/Esri/arcgis-rest-js/commit/264a12306c5f79970bac1adf3f52ddf18db1a83c)
  - **api-ref**: display tuples properly, lookup type references by name [`d3729fe`](https://github.com/Esri/arcgis-rest-js/commit/d3729fe35d9f9636a96a46c5a57720d7702c680c)
  - **fix dead links**: fixed broken links within declaration page content [`4fac8bc`](https://github.com/Esri/arcgis-rest-js/commit/4fac8bc1f3944176bd1094d87ab7f6b415c5857f)
  - **get-started**: improve getting started guides [`14f13cb`](https://github.com/Esri/arcgis-rest-js/commit/14f13cb0a4cc47d2e543aaaf283c0ddae1d0e3d6)
  - **documentation-site**: fix docs:deploy script, build and deploy docs after publish [`141ea9b`](https://github.com/Esri/arcgis-rest-js/commit/141ea9b64f19ae1456e030b9d2a852533bed972f)
  - **cleanup**: clear build folder before running docs:build or docs:serve [`fa692bc`](https://github.com/Esri/arcgis-rest-js/commit/fa692bc2495e48004efa0188e55a098a8eda1d18)
  - **refactor**: setup docs to run locally and on esri.github.io/arcgis-rest-js/ [`b4f0d94`](https://github.com/Esri/arcgis-rest-js/commit/b4f0d943acb17c41b3f8f4a4da7511543d1e2aa1)
  - **helpers**: add helpers to generate CDN links and NPM install commands [`c5599ec`](https://github.com/Esri/arcgis-rest-js/commit/c5599ec8cdafe123ec1ad0af4caa42169c9c0552)
- Bug Fixes
  - **oauth**: check for window parent correctly in oauth without popup [`94edc2a`](https://github.com/Esri/arcgis-rest-js/commit/94edc2a1d3110d448fd7abe8367812deccbc7647)
- Misc.
  - **package.json scripts**: dont stage everything when npm run c is called [`a21e98e`](https://github.com/Esri/arcgis-rest-js/commit/a21e98e27ecd7884d579006bb65f0e95370031a2)

### batch-geocoder

- Documentation
  - **batch geocoder**: add new demo to batch geocode addresses from csv in node [`152c9d8`](https://github.com/Esri/arcgis-rest-js/commit/152c9d88663555d3b05a38f374114bf8ddd18394) [#97](https://github.com/Esri/arcgis-rest-js/issues/97)

### node-cli

- Documentation
  - **ago node-cli**: add node-cli demo to search ago [`50c879c`](https://github.com/Esri/arcgis-rest-js/commit/50c879c3c66e49d7d82aa167e9ebe7fb7f4373c8)

## [1.0.2] - December 21st 2017

### Other Changes

- Documentation
  - **cleanup**: clear build folder before running docs:build or docs:serve [`fa692bc`](https://github.com/Esri/arcgis-rest-js/commit/fa692bc2495e48004efa0188e55a098a8eda1d18)
  - **refactor**: setup docs to run locally and on esri.github.io/arcgis-rest-js/ [`b4f0d94`](https://github.com/Esri/arcgis-rest-js/commit/b4f0d943acb17c41b3f8f4a4da7511543d1e2aa1)
- Bug Fixes
  - **release-automation**: run git fetch --all in release:prepare to make sure all changes are fetch f [`bb7d9e8`](https://github.com/Esri/arcgis-rest-js/commit/bb7d9e8022faab14b5e9e24cf95c7374013335b5)
  - **release**: resolve issues from accidental 1.0.1 release. [`ddd3d6c`](https://github.com/Esri/arcgis-rest-js/commit/ddd3d6cab0fb0d789da866cea07244b7a170d9fd)
  - **release-automation**: fix release automation to prep for a 1.0.2 relase [`9dfd957`](https://github.com/Esri/arcgis-rest-js/commit/9dfd9570dd3fb9cf532b84a59a0a007082145574)
  - **release-automation**: checkout a temporary branch for release to not polute the main branch [`75a9dec`](https://github.com/Esri/arcgis-rest-js/commit/75a9decff5f9cca3b1b21a3af16e29701af3b9a2)
  - **release-automation**: fix issues uncovered by 1st release [`e6329f5`](https://github.com/Esri/arcgis-rest-js/commit/e6329f587509a9e35df5c8f8bb4cbc287724552c)

## [1.0.1] - December 21st 2017

### Other Changes

- Bug Fixes
  - **release-automation**: fix issues found in https://github.com/Esri/arcgis-rest-js/pull/80. [`3b42fe9`](https://github.com/Esri/arcgis-rest-js/commit/3b42fe9969cc2f6a21428692c72ada8ffffb59a6)
  - **release-automation**: fix issues uncovered by 1st release [`a73b76f`](https://github.com/Esri/arcgis-rest-js/commit/a73b76f58843d538d8b29b1ae60a72a9f57ac5ec)

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
[1.9.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.8.0...v1.9.0 "v1.9.0"
[1.10.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.9.0...v1.10.0 "v1.10.0"
[1.11.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.10.0...v1.11.0 "v1.11.0"
[1.11.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.11.0...v1.11.1 "v1.11.1"
[1.12.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.11.1...v1.12.0 "v1.12.0"
[1.13.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.12.0...v1.13.0 "v1.13.0"
[1.13.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.13.0...v1.13.1 "v1.13.1"
[1.13.2]: https://github.com/Esri/arcgis-rest-js/compare/v1.13.1...v1.13.2 "v1.13.2"
[1.14.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.13.2...v1.14.0 "v1.14.0"
[1.14.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.14.0...v1.14.1 "v1.14.1"
[1.14.2]: https://github.com/Esri/arcgis-rest-js/compare/v1.14.1...v1.14.2 "v1.14.2"
[1.14.3]: https://github.com/Esri/arcgis-rest-js/compare/v1.14.2...v1.14.3 "v1.14.3"
[1.14.4]: https://github.com/Esri/arcgis-rest-js/compare/v1.14.3...v1.14.4 "v1.14.4"
[1.15.2]: https://github.com/Esri/arcgis-rest-js/compare/v1.14.4...v1.15.2 "v1.15.2"
[1.16.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.15.2...v1.16.0 "v1.16.0"
[1.16.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.16.0...v1.16.1 "v1.16.1"
[1.17.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.16.1...v1.17.0 "v1.17.0"
[1.17.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.17.0...v1.17.1 "v1.17.1"
[1.18.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.17.1...v1.18.0 "v1.18.0"
[1.19.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.18.0...v1.19.0 "v1.19.0"
[1.19.1]: https://github.com/Esri/arcgis-rest-js/compare/v1.19.0...v1.19.1 "v1.19.1"
[1.19.2]: https://github.com/Esri/arcgis-rest-js/compare/v1.19.1...v1.19.2 "v1.19.2"
[2.0.0]: https://github.com/Esri/arcgis-rest-js/compare/v1.19.2...v2.0.0 "v2.0.0"
[2.0.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.0.0...v2.0.1 "v2.0.1"
[2.0.2]: https://github.com/Esri/arcgis-rest-js/compare/v2.0.1...v2.0.2 "v2.0.2"
[2.0.3]: https://github.com/Esri/arcgis-rest-js/compare/v2.0.2...v2.0.3 "v2.0.3"
[2.0.4]: https://github.com/Esri/arcgis-rest-js/compare/v2.0.3...v2.0.4 "v2.0.4"
[2.1.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.0.4...v2.1.0 "v2.1.0"
[2.1.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.1.0...v2.1.1 "v2.1.1"
[2.2.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.1.1...v2.2.0 "v2.2.0"
[2.2.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.2.0...v2.2.1 "v2.2.1"
[2.3.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.2.1...v2.3.0 "v2.3.0"
[2.4.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.3.0...v2.4.0 "v2.4.0"
[2.5.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.4.0...v2.5.0 "v2.5.0"
[2.6.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.5.0...v2.6.0 "v2.6.0"
[2.6.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.6.0...v2.6.1 "v2.6.1"
[2.7.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.6.1...v2.7.0 "v2.7.0"
[2.7.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.7.0...v2.7.1 "v2.7.1"
[2.7.2]: https://github.com/Esri/arcgis-rest-js/compare/v2.7.1...v2.7.2 "v2.7.2"
[2.8.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.7.2...v2.8.0 "v2.8.0"
[2.8.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.8.0...v2.8.1 "v2.8.1"
[2.8.2]: https://github.com/Esri/arcgis-rest-js/compare/v2.8.1...v2.8.2 "v2.8.2"
[2.9.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.8.2...v2.9.0 "v2.9.0"
[2.10.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.9.0...v2.10.0 "v2.10.0"
[2.10.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.10.0...v2.10.1 "v2.10.1"
[2.10.2]: https://github.com/Esri/arcgis-rest-js/compare/v2.10.1...v2.10.2 "v2.10.2"
[2.11.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.10.2...v2.11.0 "v2.11.0"
[2.12.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.11.0...v2.12.0 "v2.12.0"
[2.12.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.12.0...v2.12.1 "v2.12.1"
[2.13.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.12.1...v2.13.0 "v2.13.0"
[2.13.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.13.0...v2.13.1 "v2.13.1"
[2.13.2]: https://github.com/Esri/arcgis-rest-js/compare/v2.13.1...v2.13.2 "v2.13.2"
[2.14.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.13.2...v2.14.0 "v2.14.0"
[2.14.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.14.0...v2.14.1 "v2.14.1"
[2.15.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.14.1...v2.15.0 "v2.15.0"
[2.16.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.15.0...v2.16.0 "v2.16.0"
[2.17.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.16.0...v2.17.0 "v2.17.0"
[2.18.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.17.0...v2.18.0 "v2.18.0"
[2.19.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.18.0...v2.19.0 "v2.19.0"
[2.19.1]: https://github.com/Esri/arcgis-rest-js/compare/v2.19.0...v2.19.1 "v2.19.1"
[2.19.2]: https://github.com/Esri/arcgis-rest-js/compare/v2.19.1...v2.19.2 "v2.19.2"
[2.20.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.19.2...v2.20.0 "v2.20.0"
[2.21.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.20.0...v2.21.0 "v2.21.0"
[2.22.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.21.0...v2.22.0 "v2.22.0"
[2.23.0]: https://github.com/Esri/arcgis-rest-js/compare/v2.22.0...v2.23.0 "v2.23.0"
[head]: https://github.com/Esri/arcgis-rest-js/compare/v2.23.0...HEAD "Unreleased Changes"
