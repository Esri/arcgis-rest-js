[![npm version][npm-img]][npm-url]
[![gzip bundle size][gzip-image]][npm-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/arcgis-rest-js/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@esri/arcgis-rest-places.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/arcgis-rest-places
[gzip-image]: https://img.badgesize.io/https://unpkg.com/@esri/arcgis-rest-places/dist/bundled/places.umd.min.js?compression=gzip
[coverage-img]: https://codecov.io/gh/Esri/arcgis-rest-js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/Esri/arcgis-rest-js

# @esri/arcgis-rest-places

> Place finding helpers for [`@esri/arcgis-rest-request`](https://github.com/Esri/arcgis-rest-js).

### Example

```bash
npm install @esri/arcgis-rest-request
npm install @esri/arcgis-rest-places
```

```js
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { findPlacesNearPoint } from "@esri/arcgis-rest-places";

const { places } = await findPlacesNearPoint({
  x: -3.1883,
  y: 55.9533,
  categoryIds: ["13002"],
  authentication: ApiKeyManager.fromKey("YOUR_API_KEY")
});

console.log(places[0].name);
```

### [API Reference](https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-places/)

@TODO

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/arcgis-rest-js/issues) first. Have you found a new bug? Want to request a new feature? We'd [**love**](https://github.com/Esri/arcgis-rest-js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/arcgis-rest-js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### Generating Types from Open API

The places service publishes an Open API definition you can generate the types from the OpenAPI definition below:

```
npx openapi-typescript@5 https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/specification/open-api-v3-0/ --output packages/arcgis-rest-places/src/openapi-types.ts
```

The generated types are used in the interfaces for ArcGIS REST JS.
The most recent version if the Open API spec is linked to from the places documentation https://developers.arcgis.com/rest/places/

### [Changelog](https://github.com/Esri/arcgis-rest-js/blob/master/CHANGELOG.md)

### License

Copyright &copy; 2023 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](../../LICENSE) file.
