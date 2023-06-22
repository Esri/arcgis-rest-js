[![npm version][npm-img]][npm-url]
[![gzip bundle size][gzip-image]][npm-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache 2.0 licensed][license-img]][license-url]

[npm-img]: https://img.shields.io/npm/v/@esri/arcgis-rest-request.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/arcgis-rest-request
[gzip-image]: https://img.badgesize.io/https://unpkg.com/@esri/arcgis-rest-request/dist/bundled/request.umd.min.js?compression=gzip
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
- [FAQ](https://developers.arcgis.com/arcgis-rest-js/faq/)
- [Issues](#issues)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [Code of Conduct](/CODE_OF_CONDUCT.md)
- [CHANGELOG](/CHANGELOG.md)
- [License](#license)

### Example

```js
import { request } from "@esri/arcgis-rest-request";

const url =
  "https://www.arcgis.com/sharing/rest/content/items/6e03e8c26aad4b9c92a87c1063ddb0e3/data";

request(url).then((response) => {
  console.log(response); // WebMap JSON
});
```

### Get Started

To get started, go to [ArcGIS REST JS on the ArcGIS Developers website](https://developers.arcgis.com/arcgis-rest-js/).

### Documentation

The documentation is published at https://developers.arcgis.com/arcgis-rest-js/ and is maintained ina private repository and managed by the ArcGIS Developer Experience team. The [API reference](https://developers.arcgis.com/arcgis-rest-js/api-reference/) is generated automatically by [TypeDoc](https://typedoc.org/) via the `npm run typedoc` command and the [`typedoc.json` configuration file](./typedoc.json).

### Instructions

You can install dependencies by cloning the repository and running:

```bash
npm install && npm run build
```

THis will install all dependencies and do an inital build. Afterward, you can run any of the [demo apps](./demos/) by `cd`'ing by following the README for the specific demo. For a list of all available commands run `npm run`.

For all packages:

- `npm run build` - builds all distributions of every package with `ultra`, inside each package builds are done in parallel with `npm-run-all`. Output is errors only.
- `npm run build:esm`, `npm run build:cjs`, `npm run build:bundled` - as as the above but only one of our target distributions.
- `npm run dev:esm`, `npm run dev:cjs`, `npm run dev:bundled` - runs the appropriate watch command in all packages.

For a specific package:

- `npm run build -w @esri/arcgis-rest-request` - run all builds in a specific workspace
- `npm run dev -w @esri/arcgis-rest-request` - run all dev commands in a specific workspace
- `npm run build:esm -w @esri/arcgis-rest-request` - run the esm build in a specific workspace
- `npm run dev:esm -w @esri/arcgis-rest-request` - run the esm dev command in a specific workspace
- `npm run build:cjs -w @esri/arcgis-rest-request` - run the common js build in a specific workspace
- `npm run dev:cjs -w @esri/arcgis-rest-request` - run the common js dev command in a specific workspace
- `npm run build:bundled -w @esri/arcgis-rest-request` - run the rollup build in a specific workspace
- `npm run dev:bundled -w @esri/arcgis-rest-request` - run the rollup dev command in a specific workspace

### Packages

- [`@esri/arcgis-rest-request`](./packages/arcgis-rest-request/) - Core module implementing basic request code, shared TypeScript types and common utilities.
- [`@esri/arcgis-rest-portal`](./packages/arcgis-rest-portal) - Methods for working with ArcGIS Online/Enterprise content and users.
- [`@esri/arcgis-rest-feature-service`](./packages/arcgis-rest-feature-service) - Functions for querying, editing, and administering hosted feature layers and feature services.
- [`@esri/arcgis-rest-geocoding`](./packages/arcgis-rest-geocoding) - Wrapper around geocoding services.
- [`@esri/arcgis-rest-routing`](./packages/arcgis-rest-routing) - Wrapper around routing and directions services.
- [`@esri/arcgis-rest-demographics`](./packages/arcgis-rest-demographics) - Wrapper around demographic data services.
- [`@esri/arcgis-rest-palces`](./packages/arcgis-rest-palces) - Wrapper around place finding and place\ data services.

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/arcgis-rest-js/issues) first. Have you found a new bug? Want to request a new feature? We'd [**love**](https://github.com/Esri/arcgis-rest-js/issues/new) to hear from you.

If you're looking for help you can also post issues on [Stack Overflow](https://stackoverflow.com/questions/tagged/esri-oss) with the `esri-oss` tag.

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, `@esri/arcgis-rest-js` is maintained under [Semantic Versioning guidelines](https://semver.org/) and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### License

Copyright &copy; 2017-2023 Esri

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
