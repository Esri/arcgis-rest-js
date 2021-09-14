# Running this demo

This demo shows how to have webpack [tree shake](https://rollupjs.org/guide/en#tree-shaking) `@esri/rest-js` and only include methods that are actually being called in its output bundle.

1. Run `npm run build` in the root directory
1. cd into `demos/tree-shaking-webpack`
1. Run `npm run build:app` this will also generate a `stats.json` file
1. Load `index.html` in a web browser and confirm you see output.
1. Run `npm run analyze-bundle` which will open the bundle analyzer. You should only see `request` and `search` related modules.
