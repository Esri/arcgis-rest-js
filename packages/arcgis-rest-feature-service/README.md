[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/arcgis-rest-js/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@esri/arcgis-rest-feature-service.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/arcgis-rest-feature-service
[travis-img]: https://img.shields.io/travis/Esri/arcgis-rest-js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/arcgis-rest-js

# @esri/arcgis-rest-feature-service

> A module for working with ArcGIS feature services that runs in Node.js and modern browsers.

### Example

```bash
npm install @esri/arcgis-rest-request
npm install @esri/arcgis-rest-feature-service
```

```js
import { getFeature } from '@esri/arcgis-rest-feature-service';

const options = {
  url:
    "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
  id: 42
};

getFeature(options)
  .then(feature => {
    console.log(feature.attributes.FID); // 42
  });
```

### [API Reference](https://esri.github.io/arcgis-rest-js/api/feature-service/)

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/arcgis-rest-js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [**love**](https://github.com/Esri/arcgis-rest-js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/arcgis-rest-js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### License

Copyright &copy; 2017-2018 Esri

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
