# xdg-trashdir [![Build Status](https://travis-ci.org/kevva/xdg-trashdir.svg?branch=master)](https://travis-ci.org/kevva/xdg-trashdir)

> Get the correct trash path on Linux according to the [spec](http://www.ramendik.ru/docs/trashspec.html)


## Install

```
$ npm install xdg-trashdir
```


## Usage

```js
const xdgTrashdir = require('xdg-trashdir');

(async () => {
	console.log(await xdgTrashdir());
	//=> '/home/johndoe/.local/share/Trash'

	console.log(await xdgTrashdir('foo.zip'));
	//=> '/media/johndoe/UUI/.Trash-1000'

	console.log(await xdgTrashdir.all());
	//=> ['/home/johndoe/.local/share/Trash', '/media/johndoe/UUI/.Trash-1000', …]
})();
```


## API

### xdgTrashdir(file?)

Returns a `Promise<string>` with the path to the trash.

#### file

Type: `string`

Get the trash path for a specific file.

### xdgTrashdir.all()

Returns a `Promise<string[]>` with all possible trash paths.
