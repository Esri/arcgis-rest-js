[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![gzip bundle size][gzip-image]][npm-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache 2.0 licensed][license-img]][license-url]

[npm-img]: https://img.shields.io/npm/v/@esri/arcgis-rest-request.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/arcgis-rest-request
[travis-img]: https://img.shields.io/travis/Esri/arcgis-rest-js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/arcgis-rest-js
[gzip-image]: https://img.badgesize.io/https://unpkg.com/@esri/arcgis-rest-request/dist/umd/request.umd.min.js?compression=gzip
[coverage-img]: https://codecov.io/gh/Esri/arcgis-rest-js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/Esri/arcgis-rest-js
[license-img]: https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square
[license-url]: #license

# @esri/arcgis-rest-js

> compact, modular JavaScript wrappers for the ArcGIS REST API that run in Node.js and modern browsers.

## Table of Contents

- [Example](#example)
- [API Reference](#api-reference)
- [Instructions](#instructions)
- [Packages](#packages)
- [FAQ](#frequently-asked-questions)
- [Issues](#issues)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [Code of Conduct](/CODE_OF_CONDUCT.md)
- [CHANGELOG](/CHANGELOG.md)
- [License](#license)

### Example

```js
import { request } from '@esri/arcgis-rest-request';

const url = "https://www.arcgis.com/sharing/rest/content/items/6e03e8c26aad4b9c92a87c1063ddb0e3/data";

request(url)
    .then(response => {
        console.log(response) // WebMap JSON
    })
```

### API Reference

The documentation is published at http://esri.github.io/arcgis-rest-js/ (source code [here](/docs/src)).

### Instructions

You can install dependencies (and bootstrap lerna) by cloning the repository and running:

```bash
npm install
```

Afterward, for a list of all available commands run `npm run`.

Some useful commands include:

* `npm test` runs _all_ the tests and confirms the API is functioning as expected.
* There is also a `Debug Node Tests` configuration in the `.vscode/launch.json` which will run the Node tests in the VS Code debugger.
* `npm run docs:serve` will run the documentation site locally at http://localhost:3000
* `npm run build` will created UMD bundles for _all_ the packages
* `npm run dev -- <esm|node|umd> <glob>` will re-run the specified build type anytime the source code changes. Example: `npm run dev -- umd @esri/*`

### Packages

* [`@esri/arcgis-rest-request`](./packages/arcgis-rest-request/) - Underpins other packages and supports making low-level requests.
* [`@esri/arcgis-rest-auth`](./packages/arcgis-rest-auth) - Provides methods for authenticating named users and applications.
* [`@esri/arcgis-rest-common-types`](./packages/arcgis-rest-common-types) - Stores objects common across the ArcGIS API.
* [`@esri/arcgis-rest-items`](./packages/arcgis-rest-items) - Methods for working with ArcGIS Online/Enterprise content.
* [`@esri/arcgis-rest-groups`](./packages/arcgis-rest-groups) - Methods for working with ArcGIS Online/Enterprise groups.
* [`@esri/arcgis-rest-users`](./packages/arcgis-rest-users) - Methods for working with ArcGIS Online/Enterprise users.
* [`@esri/arcgis-rest-sharing`](./packages/arcgis-rest-sharing) - Methods for updating permissions for ArcGIS Online/Enterprise content.
* [`@esri/arcgis-rest-feature-service`](./packages/arcgis-rest-feature-service) - Functions for querying and editing the features inside feature services.
* [`@esri/arcgis-rest-geocoder`](./packages/arcgis-rest-geocoder) - Geocoding wrapper for `@esri/arcgis-rest-js`
* [`@esri/arcgis-rest-feature-service-admin`](./packages/arcgis-rest-feature-service-admin) - Functions for creating and updating feature services.
* [`@esri/arcgis-rest-routing`](./packages/arcgis-rest-routing) - Routing and directions wrapper for `@esri/arcgis-rest-js`.
* [`@esri/arcgis-rest-common`](./packages/arcgis-rest-common) - Stores shared methods and types used throughout the ArcGIS API.


### Frequently Asked Questions

* [Why should I use this library?](https://esri.github.io/arcgis-rest-js/guides/package-overview/)
* [Is this a _supported_ Esri product?](docs/FAQ.md#is-this-a-supported-esri-product)
* [How does this project compare with the ArcGIS API for JavaScript?](docs/FAQ.md#comparison-with-the-arcgis-api-for-javascript)
* [Is this similar to the ArcGIS API for Python?](docs/FAQ.md#comparison-with-the-arcgis-api-for-python)
* [Why TypeScript?](docs/FAQ.md#why-typescript) What if I prefer [VanillaJS](https://stackoverflow.com/questions/20435653/what-is-vanillajs)?
* [More](https://github.com/Esri/arcgis-rest-js/issues?q=is%3Aissue+sort%3Aupdated-desc+label%3Afaq+is%3Aclosed)

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/arcgis-rest-js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [**love**](https://github.com/Esri/arcgis-rest-js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/arcgis-rest-js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### License

Copyright &copy; 2017-2019 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.
