Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

### Before filing an issue

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/arcgis-rest-js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [love](https://github.com/Esri/arcgis-rest-js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

**Please include the following information in your issue:**
* Browser (or Node.js) version
* a snippet of code
* an explanation of
  * what you saw
  * what you expected to see

### I want to contribute, what should I work on?

We're just getting started so even just telling us what you want to see would be extremely helpful!

### Getting a development environment set up

You don't _have to_ but we recommend installing TypeScript, TSLint, Prettier and EditorConfig extensions for your editor of choice.

* https://atom.io/packages/atom-typescript
* https://github.com/Microsoft/TypeScript-Sublime-Plugin
* etc...

### Running the tests

@esri/arcgis-rest-js has a comprehensive test suite built with [Karma](http://karma-runner.github.io/0.12/index.html) and [Jasmine](https://jasmine.github.io/) The tests can be found in `/packages/*/test/`.

You can run _all_ the tests with `npm test`.

* `npm run test:chrome:debug` runs the Karma tests in Chrome and watches for changes. In the opened Chrome window you can click "Debug" and refresh the page to enter the debugger for tests. Note that you will be debugging the compiled JS files until https://github.com/monounity/karma-typescript/issues/144 is resolved.
* `npm run test:node:debug` run the node tests, automatically opening the Chrome debugger. This is great for debugging the tests while you are working. **REQUIRES CHROME 60+**. This also means you can do you really stupid things like run this in an infinite loop with `while :; do npm run test:node:debug; sleep 1; done` which will reopen the chrome debugger once the current one closes.

### Formatting commit messsages
Using [`npm run c`](https://github.com/Esri/arcgis-rest-js/blob/fd9005fef74c33c684273fd283aa6bd9990e8630/package.json#L110) (instead of `git commit`) create messages our handy [script](https://github.com/Esri/arcgis-rest-js/blob/master/support/changelog.js) can parse to categorize your bug fix, new feature or breaking change and associate it with relevant packages in our [CHANGELOG](CHANGELOG.md) automatically.

This isn't mandatory, but it is pretty cool. :sparkles:

### Building the documentation site locally.

We use TypeDoc and acetate to turn the inline documentation into a snazzy website.

* `npm run docs:serve` > http://localhost:3000
