# @esri/rest-js

> a compact, modular Esri JavaScript client library that runs in modern browsers and Node.js.

## Table of Contents

- [Example](#example)
- [API Reference](#api-reference)
- [Code of Conduct](#code-of-conduct)
- [Instructions](#instructions)
- [Packages](#packages)
- [FAQ](#frequently-asked-questions)
- [Issues](#issues)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [License](#license)

### Example

```js
import { request } from '@esri/arcgis-rest-request';

const url = "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data";

request(url)
    .then(response => {
        console.log(response) // WebMap JSON
    })
});
```

### API Reference

The documentation is published at https://esri.github.io/rest-js/ (source code [here](/docs/src)).

### Code of conduct

**TL;DR** - We expect folks that participate in both our online and IRL communities to be kind and considerate of others at all times.

The full CoC text can be found at http://www.esri.com/events/code-of-conduct

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

### Packages

* [`@esri/arcgis-rest-request`](./packages/arcgis-rest-request/) - Handles common functionality across all aspects of `@esri/rest-js`.
* [`@esri/arcgis-rest-auth`](./packages/arcgis-rest-auth) - Provides methods for authenticating named users and applications for `@esri/arcgis-rest-auth`.
* [`@esri/arcgis-rest-geocoding`](./packages/arcgis-rest-geocoding) - Geocoding wrapper for `@esri/rest-js`

### Frequently Asked Questions

* [Why TypeScript?](docs/FAQ.md#why-typescript) What if I prefer [VanillaJS](https://stackoverflow.com/questions/20435653/what-is-vanillajs)?
* [What is the difference between this project and the ArcGIS API for JavaScript?](docs/FAQ.md#comparison-with-other-products)

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/rest-js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [**love**](https://github.com/Esri/rest-js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/rest-js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### License

Copyright 2017 Esri

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
