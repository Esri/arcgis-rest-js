# is-valid-identifier [![Build Status](https://secure.travis-ci.org/YerkoPalma/is-valid-identifier.svg?branch=master)](https://travis-ci.org/YerkoPalma/is-valid-identifier) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> check if a string is a valid ECMAscript identifier

All the code is based on [this repo](https://github.com/mathiasbynens/mothereff.in/tree/master/js-variables), I am just putting it into npm.

## Installation

```bash
npm install --save is-valid-identifier
```

## Usage

```javascript
const isValidIdentifier = require('is-valid-identifier')

isValidIdentifier('404') // => false
isValidIdentifier('404', true) // => second argument is for strict mode, instead of returning a false, will throw an exception
```

## License

MIT

Crafted with <3 by [Yerko Palma](https://github.com/YerkoPalma).

***

> This package was initially generated with [yeoman](http://yeoman.io) and the [p generator](https://github.com/johnotander/generator-p.git).
