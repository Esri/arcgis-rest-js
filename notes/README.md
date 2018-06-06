# Testing

* Use `npm test` as normal to run all tests.
* `npm test` will run `lerna run test` which will in turn will execute `npm test` in each package if it exists with the root of the package as the `process.cwd()`
* Browser based tests are setup to run with Karma as a test runner as Jasmine as teh testing framework. There is a common config that all packages can use in the root folder called `karma.conf.js`.
* Node tests use the `jasmine` CLI tool. Each package will require a `jasmine.json` to tell jasmine where the test files are for that package. The `jasmine.json` should register the `support/register-tsnode.js` helper so TypeScript files are compiled before the tests execute.
* Currently the Node tests take quite awhile. I think this is becuase the `ignore` param isn't being respected and thus the entirety of `node_modules` get processed by TypeScript. This needs to happen in ordr to make `lodash-es` work.

# Build

The build system currently builds for 3 seperate targets:

* Common JS bundle for Node.js
* A UMD bundle for CommonJS, AMD and a global variable for browsers
* ES5 files in the ES2015 module syntax for use with Rollup and Webpack 2.

Like with tests running `npm run build` will run `lerna run build` which will run `npm run build` in each package. Currently `npm run build:node` and `npm run build:umd` both use the shared rollup configurations in `rollup.config.*.js`. `npm run build:esm` uses a `tsconfig.json` file in the root of hte repo that extends the base `tsconfig.json` file. This `tsconfig.json` tells the Typescript compiler where to out the output files and generated `.d.ts` type declarations.

These 4 outputs (2, rollup builds, ES2015 modules and type declarations) are referenced by their respective fields in `package.json`:

```js
{
  // ...

  "main": "dist/node/bundle.cjs.js",
  "browser": "dist/browser/bundle.umd.js",
  "module": "dist/esm/index.js",
  "js:next": "dist/esm/index.js",
  "types": "dist/types/index.d.ts",

  // ...
}
```

Currently we are bundling Node in order to use `lodash-es` as a utility library which needs to be bundled in.

The ES2015 build also has the references to `form-data` and `url-search-params` removed. Rollup handles ignoring these in the UMD and CJS builds but Typescirpt is not a bundler so these needed to be removed some other way. If we run into issues with sourcemaps this replacement process might need to be replaced by a custom script with [`magic-string`](https://github.com/Rich-Harris/magic-string).

# Support files

There are several general support files needed for various operations of the Typescript compiler to prevent errors:

* `support/json.d.ts` - make the typescript compiler happy when you `import` JSON files `import * as sharingRestInfo from './mocks/sharing-rest-info.json';`
* `support/lodash-es.d.ts` - currently `@types/lodash-es` has issues https://github.com/DefinitelyTyped/DefinitelyTyped/issues/15227 so this is an alternate typings file
* `register-tsnode.js` - enables on-the-fly compilation of Typescript in Node.js, used by the Jasmine tests
* `url-search-params.d.ts` - typings for the `url-search-params` module which is used to emulate `URLSearchParams` in Node.js

# Doc system

[Typedoc](https://github.com/TypeStrong/typedoc) leaves much to be desired figuring out how TypeDoc is organizing the source files is next to impossible and there is almost no doc. It does appear to be usable since project like Dojo 2 and Maquette use it however figuring out how to generate the docs in a struture that looks good is pretty beyond me after looking at it for a few hours.

A potentially better option might be to just use JSDoc and work from the compiled ES2015 source. I will look into this later.

# Release system

the release process has been entirely automated.

the command below bumps the version in each individual package.json file and parses all `npm run c` invoked commit messages since the last release to update the changelog.

```bash
npm run release:prepare
```

afterwards, you can display a diff to give you a sense of what will be committed to master when you actually publish.

```bash
npm run release:review
```

the last command increments the version in the root package.json, pushes the new tag to GitHub and publishes a release of each individual package on npm.

```bash
npm run release:publish
```

# Potential improvments

* Finding a decent alternative to `lodash/defaults` without broken typings would be ideal. This forces all kinds of weirdness on us.
* Figure out why the Node tests take so long (might be becuase of hacks needed for `lodash-es`) `lerna run test:node`
* Since we are importing `lodash-es` we need to use `karma-typescript-es6-transform` to trasform the ES2015 module syntax into CommonJS. We should look into if this is neccessary at all (i.e. replace `lodash-es`) or think about replacing it with https://github.com/jlmakes/karma-rollup-preprocessor.

# Thoughts

Basic utility libraries are going to be a problem. Most recommendation are to use something like `import defaults = require('lodash/defaults')` because you are importing a common JS module. However if you use this syntax you cannot have Typescript compile ES2015 modules which is goal for us. Not every library publishes itself as ES2015 modules.

We need to make a call on what we bundle into the library (`Promise`, `fetch`) ect... Do we ask people to bring their own polyfills or do we bundle them ourselves for simplicity. If we want to do both it will likly complicate the builds a great deal.


