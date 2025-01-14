# Scripting using ArcGIS Rest JS with Typescript and Node

ArcGIS Rest.js is really useful for automating various actions in an organization. However, getting typescript + node + ts-node + arcgis-rest-js working smoothly requires some specific settings, so this repo shows an example of a working configuration.

## Install & Run

`npm i && npm start`

You can also run specific files at the command line with `npm ts-node filename.ts`

## Configuration

In `package.json` the `type` field must be set to `module`.

In `tsconfig.json` the `module` option must be set to `esnext`

If you want to use `await` directly in the script, you also need to set the `target` to `es2017` or greater.

Optionally, you can also add a `.ts-node` section to `tsconfig.json` and specify that it should use `esm` by default.

```json
{
  "compilerOptions": {
    ...
    "module": "esnext"
    ...
  },
  "ts-node": {
    "esm": true
  }
}
```

If you don't do this, you will need to run your script using the `--esm` flag (i.e. `ts-node --esm index.ts`)

The actual example just runs a query for "water" against public items in ArcGIS Online - but you cna do

**Note** this project uses [volta](https://volta.sh) to ensure consistent node & npm versions across platforms.

If not using volta, please ensure you are using node >= 16.13.1 and npm >= 8.5.3
