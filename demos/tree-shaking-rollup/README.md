# Running this demo

This demo shows how to have rollup [tree shake](https://rollupjs.org/guide/en#tree-shaking) `@esri/rest-js` and only include methods that are actually being called in its output bundle.

1. Run `npm run build` in the root directory
1. cd into `/demos/tree-shaking-rollup/`
1. Run `npm run build:app`
1. Load `index.html` in a web browser and confirm you see output.
1. Open `stats.html`. You should only see `request` and `search` related modules.
