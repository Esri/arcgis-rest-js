# Running this demo

This demo shows how to have a tool like webpack [tree shake](https://rollupjs.org/guide/en#tree-shaking) `@esri/rest-js` and only include methods that are actually being called in its output bundle.

Since webpack loads raw [es modules](https://www.sitepoint.com/understanding-es6-modules/), something like babel can be used to transpile more backwards compatible code.

1. Make sure you run `npm run bootstrap` in the root folder to setup the dependencies
1. cd into `/demos/tree-shaking/`
1. Run `npm run build`


