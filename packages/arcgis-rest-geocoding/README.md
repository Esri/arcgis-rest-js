[![npm version][npm-img]][npm-url]
[![gzip bundle size][gzip-image]][npm-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/arcgis-rest-js/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@esri/arcgis-rest-geocoding.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/arcgis-rest-geocoding
[gzip-image]: https://img.badgesize.io/https://unpkg.com/@esri/arcgis-rest-geocoding/dist/bundled/geocoding.umd.min.js?compression=gzip
[coverage-img]: https://codecov.io/gh/Esri/arcgis-rest-js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/Esri/arcgis-rest-js

# @esri/arcgis-rest-geocoding

> Geocoding helpers for [`@esri/arcgis-rest-request`](https://github.com/Esri/arcgis-rest-js).

### Example

```bash
npm install @esri/arcgis-rest-request
npm install @esri/arcgis-rest-geocoding
```

```js
import { geocode } from "@esri/arcgis-rest-geocoding";

geocode("LAX").then((response) => {
  response.candidates[0].location;
  // => { x: -118.409, y: 33.943  }
});
```

### [API Reference](https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-geocoding/)

- [`geocode("1 World Way Los Angeles 90045")`](https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-geocoding/geocode/)

- [`suggest("Starb")`](https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-geocoding/suggest/)

- [`reverseGeocode([-118.409,33.943 ])`](https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-geocoding/reverseGeocode/)

- [`bulkGeocode()`](https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-geocoding/bulkGeocode/)

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/arcgis-rest-js/issues) first. Have you found a new bug? Want to request a new feature? We'd [**love**](https://github.com/Esri/arcgis-rest-js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/arcgis-rest-js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### In the wild

| What                                                                       | Who                                      |
| -------------------------------------------------------------------------- | ---------------------------------------- |
| [React](https://twitter.com/oppoudel/status/1022209378378805249) component | [@oppoudel](https://github.com/oppoudel) |

### [Changelog](https://github.com/Esri/arcgis-rest-js/blob/master/CHANGELOG.md)

### License

Copyright &copy; 2017-2022 Esri

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
