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

Any open issues are fair game. Even just telling us what you want to see would be extremely helpful!

### Getting a development environment set up

You don't _have to_ but we recommend installing TypeScript, Prettier and EditorConfig extensions for your editor of choice.

* https://code.visualstudio.com/
* https://github.com/Microsoft/TypeScript-Sublime-Plugin
* etc...

### Running the tests

`@esri/arcgis-rest-js` has a comprehensive test suite built with [Karma](http://karma-runner.github.io/0.12/index.html) and [Jasmine](https://jasmine.github.io/) The tests can be found in `/packages/*/test/`.

The tests also make heavy use of [`fetch-mock`](http://www.wheresrhys.co.uk/fetch-mock/) to mock the underlying `fetch()` implementation for testing.

You can run _all_ the tests with `npm test`.

* `npm run test:chrome:debug` runs the Karma tests in Chrome and watches for changes. In the opened Chrome window you can click "Debug" and refresh the page to enter the debugger for tests.
* `npm run test:node:debug` run the node tests, automatically opening the Chrome (60+) debugger. This is great for debugging the tests while you are working.

### Formatting commit messages

We require all commit messages be formatted according to [the Conventional Commits standard.](https://www.conventionalcommits.org/en/v1.0.0/). The automated build and release process uses these commits to determine changes and automatically publish changed packages and update the changelog in each package.

Please refer to [the summary of the Conventional Commits standard](https://www.conventionalcommits.org/en/v1.0.0/#summary) for how to format your commit messages. We also use [`commitlint`](https://commitlint.js.org/#/) to validate commit messages so providing a commit message in an incorrect format will result in a precommit failure.

### Documentation site

The documentation is published at https://developers.arcgis.com/arcgis-rest-js/ and is maintained ina private repository and managed by the ArcGIS Developer Experience team. The [API reference](https://developers.arcgis.com/arcgis-rest-js/api-reference/) is generated automatically by [TypeDoc](https://typedoc.org/) via the `npm run typedoc` command and the [`typedoc.json` configuration file](./typedoc.json).

If you see any issue with any page on the API Reference, you can fix that by updating the inline documentation comments in this repository. If you have an issue with one of the samples or other guide pages, please [log a documentation issue](https://github.com/Esri/arcgis-rest-js/issues/new?assignees=&labels=Documentation&template=documentation.yml).

#### How to add a new package

- In `/packages`, create a new folder with your desired new package name. 
- Each package will have it’s own `package.json` and `tsconfig.json`. These can be copied from other packages to maintain the correct configuration. Set the version of your new package at `1.0.0`.
- Create a folder in your new package called `src` in which your code will be defined. Create an `index.ts` file with a simple `console.log("hello world")` to serve as the entry point of your package.
- After creating your package, go to the root `package.json`, under the property `workspaces`, add the path to your new package.
- Run `npm install` to update the dependencies of your project and then run `npm build:esm` to build your project.
- Check in the root `/node_modules/@esri` and `/packages/{YOUR PACKAGE}/dist` that your new package and it has been built properly.
- Go into `/demos`, create a new folder and title what you want to call your demo. You can also copy one of the existing demos depending on what kind of demo you are building. Generally [the `node-typescript-es-modules`](./demos/node-typescript-es-modules) demo is a good places to start.
- Add a `package.json` in your new demo folder. Add your package as a dependency and be sure to have at least these properties in your `package.json`, `dependencies`, `name`, `version`, `description`, `license`, `type`, `main`, `scripts`, and `author`. Ensure that the `private` flag is set to `true`.
- Add a `.gitignore` in the root level of your demo folder that ignore `node_modules`. Be sure to ignore an `.env` file as well if your demo is using any personal keys or tokens with [dot-env](https://github.com/motdotla/dotenv)
- Run `npm install` within the `./demos` directory and make sure your demo folder has it's own local node_modules.
- In your demo import your package.
- To run your demo be sure to have script that has a property `start` in your demo directory and your script is pointing to the correct entry point. 
- Run `npm run start` while being in your `/demos/custom-demo` directory.
- Add a readme describing your demo.

### Watching local source for changes

you can run the command below in the root of the repo to automatically recompile a package when the raw TypeScript source changes. You can use this in conjunction with [the demos](./demos/).

```
# watch 'request' and rebuild a UMD for the browser
npm run dev -- umd @esri/arcgis-rest-request

# rebuild ES6 files
npm run dev -- esm @esri/arcgis-rest-request

# rebuild CommonJS
npm run dev -- node @esri/arcgis-rest-request

# watch all the packages
npm run dev -- umd @esri/*
```