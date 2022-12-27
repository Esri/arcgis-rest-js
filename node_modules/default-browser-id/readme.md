# default-browser-id [![Build Status](https://travis-ci.org/sindresorhus/default-browser-id.svg?branch=master)](https://travis-ci.org/sindresorhus/default-browser-id)

> Get the [bundle identifier](https://developer.apple.com/library/Mac/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/plist/info/CFBundleIdentifier) of the default browser (OS X)<br>
> Example: `com.apple.Safari`


## Install

```
$ npm install --save default-browser-id
```


## Usage

```js
const defaultBrowserId = require('default-browser-id');

defaultBrowserId().then(browserId => {
	console.log(browserId);
	//=> 'com.apple.Safari'
});
```


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
