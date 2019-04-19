---
title: What's New in v2.0.0
navTitle: What's New in v2.0.0
description: Learn what's new in v2.0.0 of ArcGIS REST JS.
order: 60
group: 1-get-started
---

# What's new in `v2.0.0?`

Our family of users and contributors [has grown (a lot!)](https://github.com/Esri/arcgis-rest-js/blob/master/docs/FAQ.md#who-is-using-these-packages) since our first release so we decided to rollup our sleeves (groan) and overhaul the API. Our goals were to:

1. Make ArcGIS REST JS as consistent (and simple) as possible
2. Introduce building blocks for compositional/fluent APIs
3. Provide a few new options to reuse common parameters

## Fluent APIs

In `v2.0.0` we introduced a new class called `SearchQueryBuilder` to help compose complex parameters.

```ts
// old
import { searchItems } from "@esri/arcgis-rest-items";

searchItems({ q: "Trees AND owner:US Forest Service" })
```

```ts
// new
import { searchItems, SearchQueryBuilder } from "@esri/arcgis-rest-portal";

const q = new SearchQueryBuilder()
  .match("Trees")
  .and()
  .match("US Forest Service")
  .in("owner");

searchItems({ q })
```

Currently only `searchItems()` and `searchGroups()` accept `SearchQueryBuilder` as an input, but we've included building blocks (groan) to create additional implementations as well.

## Paging

The promises returned by `searchItems()` and `searchGroups()` also got a handy new `nextPage()` method to make it easier to sift through paginated results.

```ts
searchItems({ q })
  .then(response => {
    if (response.nextPage) {
      r.nextPage()
        .then(responsePageTwo)
    }
  })
```

## Reuse parameters

We added two new methods to `@esri/arcgis-rest-request` as helpers for passing repeat options through.

### `setDefaultOptions()`

Now, if you want to ensure that _all_ requests include a custom option, you can use `setDefaultOptions()`.

```ts
import { request, setDefaultRequestOptions } from "@esri/arcgis-rest-request";

setDefaultRequestOptions({
  headers: { "Custom-Header": "Test Value" }
});

const url = `https://www.arcgis.com/sharing/rest/info`;

// the custom header will *always* be passed along
request(url)
```

You should _not_ pass `authentication` to this method if your code runs in a shared environment like a web server that handles requests for more than one user.

### `withOptions()`

If you'd like to pass common options through in only _some_ requests, you can use a new `withOptions()` method.

```ts
import { request, withOptions } from "@esri/arcgis-rest-request";

const authenticatedRequest = withOptions({
  authentication: session
}, request);

// includes authenticated session
authenticatedRequest(url)

// does NOT include authenticated session
authenticatedRequest(url)
```

## Breaking Changes

In order to make the API more consistent and a little easier to navigate, we had to break a few 🍳s.

#### One `portal` package to rule them all (even for ArcGIS Online)

We consolidated four existing packages into a new one called `@esri/arcgis-rest-portal`. Whether you want to talk to ArcGIS Online _or_ Enterprise, now you'll do this:
```bash
# new
npm install @esri/arcgis-rest-portal
```
instead of this:
```bash
# old
npm install @esri/arcgis-rest-items &&
@esri/arcgis-rest-users &&
@esri/arcgis-rest-groups &&
@esri/arcgis-rest-sharing
```
The table below lists methods in this package that have been deprecated, given a facelift, or given a new home.

| Old | New | Package
| -- | -- | -- |
| ~~`serializeGroup()`~~ |  |
| ~~`createItemInFolder({ folder })`~~ | `createItemInFolder({ folderId })` |
| ~~`searchItems( string|opts )`~~ | `searchItems( string|opts|Builder )` |
| ~~`searchGroups( form, opts )`~~ | `searchGroups( string|opts|Builder )` |
| ~~`getItemResources( opts )`~~ | `getItemResources( id, opts? )` |
| `getUserUrl()` | `getUserUrl()` | ~~`auth`~~ `portal` |
| `getPortalUrl()` | `getPortalUrl()` | ~~`request`~~ `portal` |
| `getPortal()` | `getPortal()` | ~~`request`~~ `portal` |
|  | `SearchQueryBuilder` | `portal` |

#### `@esri/arcgis-rest-request`

The only breaking changes we made to `request` were to refactor an internal method and move a couple over to the new `portal` package.

| Old | New | Package Name |
| -- | -- | -- |
| `getPortalUrl()` | `getPortalUrl()` | ~~`request`~~ `portal` |
| `getPortal()` | `getPortal()` | ~~`request`~~ `portal` |
| `appendCustomParams()` | `appendCustomParams()`* | ~~`feature-service`~~ `request` (new signature) |

#### If you work with private services (shhhh)

We didn't make many changes in `@esri/arcgis-rest-auth`, but one method moved and two others got simpler.

| Old | New | Package Name |
| -- | -- | -- |
| `getUserUrl()` | `getUserUrl()` | ~~`auth`~~ `portal` |
| `fetchToken(params|opts)` | `fetchToken(opts)` |
| `generateToken(params|opts)` | `generateToken(opts)` |

#### `@esri/arcgis-rest-routing`

In this package, we renamed one constant.

| Old | New |
| -- | -- |
| ~~`worldRoutingService`~~ | `ARCGIS_ONLINE_ROUTING_URL` |

#### Geocoding addresses

In the interest of consistency, we renamed our geocoding package.

```bash
# new
npm install @esri/arcgis-rest-geocoding
```

```bash
# old
npm install @esri/arcgis-rest-geocoder
```

We renamed one method (and one constant) as well.

| Old | New |
| -- | -- |
| ~~`serviceInfo()`~~ | `getGeocodeService()` |
| ~~`worldGeocoder`~~ | `ARCGIS_ONLINE_GEOCODING_URL` |

#### Querying and editing feature layers

This package was renamed too. If you're already using `queryFeatures()` or making edits inside hosted feature layers, now you'll install this:

```bash
# new
npm install @esri/arcgis-rest-feature-layer
```

instead of this:
```bash
# old
npm install @esri/arcgis-rest-feature-service
```
The `feature-layer` methods that were refactored or re-homed are listed below.

| Old | New | Package |
| -- | -- | -- |
| ~~`addFeatures({ adds })`~~ | `addFeatures({ features })` |
| ~~`updateFeatures({ updates })`~~ | `updateFeatures({ features })` |
| ~~`deleteFeatures({ deletes })`~~ | `updateFeatures({ objectIds })` |
| `appendCustomParams()` | `appendCustomParams()`* | ~~`feature-service`~~ `request` (new signature) |

#### Publishing and updating new hosted feature services

If you're already using `rest-js` to publish _new_ hosted feature services, the package for that has a new (shorter) name too.

```bash
# new
npm install @esri/arcgis-rest-service-admin
```
instead of this:
```bash
# old
npm install @esri/arcgis-rest-feature-service-admin
```
After you save those seven keystrokes, everything else is the same.

## Breaking Changes for TypeScript developers

Each package now installs shared TypeScript typings automatically and  re-exports them, so its no longer necessary to install a separate package yourself.

```ts
// old
import { IPoint } from "@esri/arcgis-rest-common-types";
import { reverseGeocode } from "@esri/arcgis-rest-geocoder";

reverseGeocode({ x: 34, y: -118} as IPoint);

// new
import { IPoint, reverseGeocode } from "@esri/arcgis-rest-geocoding";

reverseGeocode({ x: 34, y: -118} as IPoint);
```

If you'd _like_ to install the typings yourself, You'll use a more concise package name.

```bash
# new package name
npm install @esri/arcgis-rest-types
```

The table below lists interfaces and types that have been removed or renamed in the name of consistency and brevity.

| Old Interface | New Interface |
| -- | -- |
| ~~`esriFieldTypes`~~ | `FieldTypes` |
| ~~`esriGeometryType`~~ | `GeometryType` |
| ~~`esriUnits`~~ | `Units` |
| ~~`IOauth2Options`~~ | `IOAuth2Options` |
| ~~`IBulkGeocodingRequestOptions`~~ | `IBulkGeocodeOptions` |
| ~~`IGeocodeRequesttOptions`~~ | `IGeocodeOptions` |
| ~~`IGeocodeParams`~~ |  |
| ~~`ISolveRouteRequestOptions`~~ | `ISolveRouteOptions` |
| ~~`IQueryFeaturesRequestOptions`~~ | `IQueryFeaturesOptions` |
| ~~`IQueryRelatedRequestOptions`~~ | `IQueryRelatedOptions` |
| ~~`IAddFeaturesRequestOptions`~~ | `IAddFeaturesOptions` |
| ~~`IUpdateFeaturesRequestOptions`~~ | `IUpdateFeaturesOptions` |
| ~~`IDeleteFeaturesRequestOptions`~~ | `IDeleteFeaturesOptions` |
| ~~`IDecodeValuesRequestOptions`~~ | `IDecodeValuesOptions` |
| ~~`ILayerRequestOptions`~~ | `IGetLayerOptions` |
| ~~`IFeatureRequestOptions`~~ | `IGetFeatureOptions` |
| ~~`IAddToServiceDefinitionRequestOptions`~~ | `IAddToServiceDefinitionOptions` |
| ~~`ICreateServiceRequestOptions`~~ | `ICreateServiceOptions` |
| ~~`IItemResourceAddRequestOptions`~~ |  |
|  | `IParamBuilder` |
|  | `IParamsBuilder` |

That's it! We know that moving so much 🧀 is a hassle, but future devs send their thanks! 🎩