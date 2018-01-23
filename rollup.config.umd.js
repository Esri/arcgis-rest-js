import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import uglify from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";

const path = require("path");
const fs = require("fs");
const _ = require("lodash");

/**
 * The module name will be the name of the global variable used in UMD builds.
 * All exported members of each package will be attached to this global.
 */
const moduleName = "arcgisRest";

/**
 * Since Rollup runs inside each package we can just get the name of the current
 * package we are bundling.
 */
const { name } = require(path.join(process.cwd(), "package.json"));

/**
 * Now we need to discover all the `@esri/arcgis-rest-*` package names so we can create
 * the `globals` and `externals` to pass to Rollup.
 */
const packageNames = fs
  .readdirSync(path.join(__dirname, "packages"))
  .filter(p => p[0] !== ".")
  .map(p => {
    return require(path.join(__dirname, "packages", p, "package.json")).name;
  }, {});

/**
 * Rollup will use this map to determine where to lookup modules on the global
 * window object when neither AMD or CommonJS is being used. This configuration
 * will cause Rollup to lookup all imports from our packages on a single global
 * `arcgisRest` object.
 */
const globals = packageNames.reduce((globals, p) => {
  globals[p] = moduleName;
  return globals;
}, {});

/**
 * Now we can export the Rollup config!
 */
export default {
  entry: "./src/index.ts",
  dest: `./dist/browser/${name.replace("@esri/", "")}.umd.js`,
  format: "umd",
  sourceMap: true,
  context: "window",
  extend: true, // causes this module to extend the global specified by `moduleName`
  moduleName,
  globals,
  plugins: [
    typescript(),
    json(),
    resolve(),
    commonjs(),
    uglify(),
    filesize()
  ]
};
