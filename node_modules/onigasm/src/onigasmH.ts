// Just to keep typescript quiet
declare const require
declare const WebAssembly

const OnigasmModuleFactory = require('./onigasm.js' /** when TS is compiled to JS, this will mean `lib/onigasm.js` (emitted by `emcc`) */)

/**
 * Handle to onigasm module (the JS glue code emitted by emscripten, that provides access to C/C++ runtime)
 *
 * Single handle shared among modules that decorate the C runtime to deliver `atom/node-oniguruma` API
 */
export let onigasmH

async function initModule(bytes: ArrayBuffer) {
    return new Promise((resolve, reject) => {
        const { log, warn, error } = console
        OnigasmModuleFactory({
            instantiateWasm(imports, successCallback) {
                WebAssembly.instantiate(bytes, imports)
                    .then((output) => {
                        successCallback(output.instance)
                    })
                    .catch((e) => {
                        throw e
                    })
                return {}
            },
        })
            .then(moduleH => {
                onigasmH = moduleH
                resolve()
            })
        if (typeof print !== 'undefined') {
            // can be removed when https://github.com/emscripten-core/emscripten/issues/9829 is fixed.
            // tslint:disable-next-line:no-console
            console.log = log
            // tslint:disable-next-line:no-console
            console.error = error
            // tslint:disable-next-line:no-console
            console.warn = warn
        }
    })
}

let isInitialized = false

/**
 * Mount the .wasm file that will act as library's "backend"
 * @param data Path to .wasm file or it's ArrayBuffer
 */
export async function loadWASM(data: string | ArrayBuffer) {
    if (isInitialized) {
        throw new Error(`Onigasm#init has been called and was succesful, subsequent calls are not allowed once initialized`)
    }
    if (typeof data === 'string') {
        const arrayBuffer = await (await fetch(data)).arrayBuffer()
        await initModule(arrayBuffer)
    } else if (data instanceof ArrayBuffer) {
        await initModule(data)
    } else {
        throw new TypeError(`Expected a string (URL of .wasm file) or ArrayBuffer (.wasm file itself) as first parameter`)
    }

    isInitialized = true
}
