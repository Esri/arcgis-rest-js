[![Build Status](https://circleci.com/gh/jasmine/jasmine-npm.svg?style=shield)](https://circleci.com/gh/jasmine/jasmine-npm)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjasmine%2Fjasmine-npm.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjasmine%2Fjasmine-npm?ref=badge_shield)

# The Jasmine Module

The `jasmine` module is a command line interface and supporting code for running
[Jasmine](https://github.com/jasmine/jasmine) specs under Node.

The core of jasmine lives at https://github.com/jasmine/jasmine and is `jasmine-core` in npm.

## Contents

This module allows you to run Jasmine specs for your Node.js code. The output will be displayed in your terminal by default.

## Documentation

https://jasmine.github.io/edge/node.html

## Installation
```sh
# Local installation:
npm install --save-dev jasmine

# Global installation
npm install -g jasmine
```

## Initializing

To initialize a project for Jasmine

`jasmine init`

To initialize a project for Jasmine when being installed locally

`node_modules/.bin/jasmine init`

or

`npx jasmine init`

To seed your project with some examples

`jasmine examples`

## Usage

To run your test suite

`jasmine`

## Configuration

Customize `spec/support/jasmine.json` to enumerate the source and spec files you would like the Jasmine runner to include.
You may use dir glob strings.
More information on the format of `jasmine.json` can be found in [the documentation](http://jasmine.github.io/edge/node.html#section-Configuration)

Alternatively, you may specify the path to your `jasmine.json` by setting an environment variable or an option:

```shell
jasmine JASMINE_CONFIG_PATH=relative/path/to/your/jasmine.json
jasmine --config=relative/path/to/your/jasmine.json
```

## Using ES modules

If the name of a spec file or helper file ends in `.mjs`, Jasmine will load it
as an [ES module](https://nodejs.org/docs/latest-v13.x/api/esm.html) rather 
than a CommonJS module. This allows the spec file or helper to import other 
ES modules. No extra configuration is required.

You can also use ES modules with names ending in `.js` by adding 
`"jsLoader": "import"` to `jasmine.json`. This should work for CommonJS modules
as well as ES modules. We expect to make it the default in a future release.
Please [log an issue](https://github.com/jasmine/jasmine-npm/issues) if you have
code that doesn't load correctly with `"jsLoader": "import"`.


# Filtering specs

Execute only those specs which filename match given glob:

```shell
jasmine "spec/**/critical/*Spec.js"
```

Or a single file:

```shell
jasmine spec/currentSpec.js
```

Or execute only those specs which name matches a particular regex:

```shell
jasmine --filter "adapter21*"
```

(where the *name* of a spec is the first parameter passed to `describe()`)


## Support

Documentation: [jasmine.github.io](https://jasmine.github.io)
Jasmine Mailing list: [jasmine-js@googlegroups.com](mailto:jasmine-js@googlegroups.com)
Twitter: [@jasminebdd](http://twitter.com/jasminebdd)

Please file issues here at Github

Copyright (c) 2008-2017 Pivotal Labs. This software is licensed under the MIT License.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjasmine%2Fjasmine-npm.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjasmine%2Fjasmine-npm?ref=badge_large)
