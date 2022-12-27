/**
 * Handle to onigasm module (the JS glue code emitted by emscripten, that provides access to C/C++ runtime)
 *
 * Single handle shared among modules that decorate the C runtime to deliver `atom/node-oniguruma` API
 */
export declare let onigasmH: any;
/**
 * Mount the .wasm file that will act as library's "backend"
 * @param data Path to .wasm file or it's ArrayBuffer
 */
export declare function loadWASM(data: string | ArrayBuffer): Promise<void>;
