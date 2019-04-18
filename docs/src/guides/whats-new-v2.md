---
title: What's New in v2
navTitle: What's New in v2
description: Learn whats new in v2.0.0 of ArcGIS REST JS.
order: 60
group: 1-get-started
---

# What's new in `v2.0.0?`

Our family of contributors has grown a lot since we released `v1.0.0` so we decided to rollup our sleeves and make some improvements to the API. Our goals are to:

1. Make `rest-js` as consistent (and simple) as possible
2. Introduce building blocks for compositional/fluent APIs
3. Provide a few new options to reuse common parameters

## Fluent APIs

`SearchQueryBuilder`

to do

## Reuse parameters

`withOptions()`

to do

## Breaking Changes

In order to make the API more consistent and easy to navigate, we had to break a few 🍳s.

#### One `portal` package to rule them all (even for ArcGIS Online)

Whether you want to talk to ArcGIS Online _or_ Enterprise, you can now do this:
```bash
npm install @esri/arcgis-rest-portal
```
instead of this:
```bash
npm install @esri/arcgis-rest-items &&
@esri/arcgis-rest-users &&
@esri/arcgis-rest-groups &&
@esri/arcgis-rest-sharing
```
The table below lists methods in `@esri/arcgis-rest-portal` that have either been deprecated, given a facelift, or given a new home.

| Old | New | Package
| -- | -- | -- |
| ~~`serializeGroup()`~~ |  |
| ~~`createItemInFolder({ folder })`~~ | `createItemInFolder({ folderId })` |
| ~~`searchItems(string|opts)`~~ | `searchItems( string|opts|Builder )` |
| ~~`searchGroups(form, opts)`~~ | `searchGroups( string|opts|Builder )` |
| ~~`getItemResources(opts)`~~ | `getItemResources(id, opts?)` |
| `getUserUrl()` | `getUserUrl()` | ~~`auth`~~ `portal` |
| `getPortalUrl()` | `getPortalUrl()` | ~~`request`~~ `portal` |
| `getPortal()` | `getPortal()` | ~~`request`~~ `portal` |
|  | `SearchQueryBuilder` | `portal` |

#### Querying and editing feature layers

Now you'll install this
```bash
npm install @esri/arcgis-rest-feature-layer
```
instead of this:
```bash
npm install @esri/arcgis-rest-feature-service
```
Inside the package, these are the methods that have been refactored or re-homed.

| Old | New | Package |
| -- | -- | -- |
| ~~`addFeatures({ adds })`~~ | `addFeatures({ features })` |
| ~~`updateFeatures({ updates })`~~ | `updateFeatures({ features })` |
| ~~`deleteFeatures({ deletes })`~~ | `updateFeatures({ objectIds })` |
| `appendCustomParams()` | `appendCustomParams()`* | ~~`feature-service`~~ `request` (new signature) |

#### Publishing and updating new hosted feature services

This package has a new, shorter name too.

```bash
npm install @esri/arcgis-rest-service-admin
```
instead of this:
```bash
npm install @esri/arcgis-rest-feature-service-admin
```
After you save those seven keystrokes, everything else is the same.

#### Geocoding addresses

We couldn't resist renaming the `geocoding` package either.

```bash
npm install @esri/arcgis-rest-geocoding
```

In this package, only one method was renamed.

| Old | New | Package Name |
| -- | -- | -- |
| ~~`serviceInfo()`~~ | `getGeocodeService()` | ~~`geocoder`~~ `geocoding`

#### If you work with private services (shhhh)

Its still just:
```bash
npm install @esri/arcgis-rest-auth
```
And these are the signatures that have either moved or gotten simpler.

| Old | New | Package Name |
| -- | -- | -- |
| `getUserUrl()` | `getUserUrl()` | ~~`auth`~~ `portal` |
| `fetchToken(params|opts)` | `fetchToken(opts)` |
| `generateToken(params|opts)` | `generateToken(opts)` |

#### If you just install `request`

We moved a couple helper methods over to the new `portal` package.

| Old | New | Package Name |
| -- | -- | -- |
| `getPortalUrl()` | `getPortalUrl()` | ~~`request`~~ `portal` |
| `getPortal()` | `getPortal()` | ~~`request`~~ `portal` |

## Breaking Changes for TypeScript developers

* Each package now installs shared TypeScript typings automatically and  re-exports them. If you'd like to install them yourself, you can do this.

Its still just:
```bash
npm install @esri/arcgis-rest-types
```
The interfaces below have been removed (or renamed)

| Old | New |
| -- | -- |
| ~~`esriUnits`~~ | `Units` |
| ~~`esriFieldTypes`~~ | `FieldTypes` |
| ~~`esriGeometryType`~~ | `GeometryType` |
| ~~`IOauth2Options`~~ | `IOAuth2Options` |
| ~~`IBulkGeocodingRequestOptions`~~ | `IBulkGeocodeOptions` |
| ~~`IGeocodeRequesttOptions`~~ | `IGeocodeOptions` |
| ~~`IGeocodeParams`~~ |  |
| ~~`IItemResourceAddRequestOptions`~~ |  |
|  | IParamBuilder |
|  | IParamsBuilder |

That's it! Sorry to move so much 🧀 on you, but future devs send their thanks! 🎩