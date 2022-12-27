# @terraformer/arcgis

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/@terraformer/arcgis.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@terraformer/arcgis
[travis-image]: https://img.shields.io/travis/terraformer-js/terraformer/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/terraformer-js/terraformer
[standard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/semistandard

> Convert ArcGIS JSON geometries to GeoJSON geometries and vice versa.

## Install

```shell
npm install @terraformer/arcgis
```

## API Reference

<a name="module_Terraformer"></a>

## Terraformer

* [Terraformer](#module_Terraformer)
    * [.arcgisToGeoJSON(JSON, [idAttribute])](#module_Terraformer.arcgisToGeoJSON) ⇒ <code>object</code>
    * [.geojsonToArcGIS(GeoJSON, [idAttribute])](#module_Terraformer.geojsonToArcGIS) ⇒ <code>object</code>

<a name="module_Terraformer.arcgisToGeoJSON"></a>

### Terraformer.arcgisToGeoJSON(JSON, [idAttribute]) ⇒ <code>object</code>
Converts [ArcGIS JSON](https://developers.arcgis.com/documentation/core-concepts/features-and-geometries/) into GeoJSON.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>object</code> - GeoJSON.
```js
import { arcgisToGeoJSON } from "@terraformer/arcgis"

arcgisToGeoJSON({
  "x":-122.6764,
  "y":45.5165,
  "spatialReference": {
    "wkid": 4326
  }
});

>> { "type": "Point", "coordinates": [ -122.6764, 45.5165 ] }
```  

| Param | Type | Description |
| --- | --- | --- |
| JSON | <code>object</code> | The input ArcGIS geometry, feature or feature collection. |
| [idAttribute] | <code>string</code> | When converting an ArcGIS Feature its attributes will contain the ID of the feature. If something other than OBJECTID or FID stores the ID, you should pass through the fieldname explicitly. |

<a name="module_Terraformer.geojsonToArcGIS"></a>

### Terraformer.geojsonToArcGIS(GeoJSON, [idAttribute]) ⇒ <code>object</code>
Converts [GeoJSON](https://tools.ietf.org/html/rfc7946) into ArcGIS JSON.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>object</code> - ArcGIS JSON.
```js
import { geojsonToArcGIS } from "@terraformer/arcgis"

geojsonToArcGIS({
  "type": "Point",
  "coordinates": [45.5165, -122.6764]
})

>> { "x":-122.6764, "y":45.5165, "spatialReference": { "wkid": 4326 } }
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |
| [idAttribute] | <code>string</code> | When converting GeoJSON features, the id will be set as the OBJECTID unless another fieldname is supplied. |

* * *

## Usage

### Browser (from CDN)

This package is distributed as a [UMD](https://github.com/umdjs/umd) module and can also be used in AMD based systems or as a global under the `Terraformer` namespace.

```html
<script src="https://unpkg.com/@terraformer/arcgis"></script>
```
```js
Terraformer.arcgisToGeoJSON(/* ... */);
```

### Node.js

```js
const Terraformer = require('@terraformer/arcgis');

Terraformer.geojsonToArcGIS(/* ... */);
```

### ES module in the browser

```html
<script type='module'>
  import { arcgisToGeoJSON } from 'https://unpkg.com/@terraformer/arcgis?module';

  // look ma, no build step!
  arcgisToGeoJSON(/* ... */);
</script>
```

## [Contributing](./CONTRIBUTING.md)

## TypeScript

Type definitions for `@terraformer/arcgis` can be found at [@types/terraformer__arcgis](https://www.npmjs.com/package/@types/terraformer__arcgis). To install into your own project:

```
npm install @types/terraformer__arcgis
```

## Ports

| Project | Language | Status | Maintainer |
| - | - | - | - |
| [`arcgis2geojson`](https://github.com/chris48s/arcgis2geojson/) | Python | Incomplete | [@chris48s](https://github.com/chris48s) |

## [LICENSE](https://raw.githubusercontent.com/terraformer-js/terraformer/master/LICENSE)
