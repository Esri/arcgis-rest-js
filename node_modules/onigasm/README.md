# Onigasm (**Onig**uruma**ASM**)

`WebAssembly` port of Oniguruma regex library.

Usage/API/Behaviour 1:1 with [`node-oniguruma`](https://github.com/atom/node-oniguruma) port, tests are literally imported from `node-oniguruma` repository for maximum compliance.

Of course, unlike `node-oniguruma`, this library can't hook into roots of `V8` and is therefore 2 times* slower than the former.

## Instructions for porting your app to web

### Install

```bash
npm i onigasm
```

### Light it up

> WASM must be loaded before you use any other feature like `OnigRegExp` or `OnigScanner`

```javascript
// index.js (entry point)

import { loadWASM } from 'onigasm'
import App from './App'

(async () => {
    await loadWASM('path/to/onigasm.wasm') // You can also pass ArrayBuffer of onigasm.wasm file
    App.start()
})()

// `onigasm.wasm` file will be available at `onigasm/lib/onigasm.wasm` in `node_modules` of your project directory
```

> Once loaded `onigasm` is a drop-in replacement for `oniguruma`

```diff
- import { OnigRegExp } from 'oniguruma'
+ import { OnigRegExp } from 'onigasm'
```

### That's it!

\* Tested under laboratory conditions using `benchmark.js`
___

### License

`onigasm` is licensed under MIT License. See `LICENSE` in the root of this project for more info.

### Contributors/Maintainers
- [@neeksandhu](https://github.com/NeekSandhu) (Neek Sandhu)
- [@aeschli](https://github.com/aeschli) (Martin Aeschlimann)

