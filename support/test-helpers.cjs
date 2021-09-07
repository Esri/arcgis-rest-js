// // ensures node-fetch is available as a global
// require("cross-fetch/polyfill");

require("ts-node").register({
  compilerOptions: {
    module: "ESNext",
    esModuleInterop: true,
    noImplicitAny: false,
    allowSyntheticDefaultImports: true /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */,
  },
});
