# ansi-split

Split a string into an array based on where an ansi code is present

```
npm install ansi-split
```

[![Build Status](https://travis-ci.org/mafintosh/ansi-split.svg?branch=master)](https://travis-ci.org/mafintosh/ansi-split)

## Usage

``` js
var ansiSplit = require('ansi-split')
var chalk = require('chalk')

// prints ['hello world']
console.log(ansiSplit('hello world'))

// prints ['', '\u001b[31m', 'hello', '\u001b[39m', ' world']
console.log(ansiSplit(chalk.red('hello') + ' world'))

// prints ['', '\u001b[31m\u001b[1m', 'hello', '\u001b[22m\u001b[39m', ' ', '\u001b[32m', 'world', '\u001b[39m', '']
console.log(ansiSplit(chalk.red.bold('hello') + ' ' + chalk.green('world')))
```

## API

#### `var array = ansiSplit(str)`

Splits a string everytime there is an ansi code present.
The result is an array where every even index is a non-ansi string and every odd index if an ansi string

## License

MIT
