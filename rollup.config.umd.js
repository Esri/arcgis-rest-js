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
 * Since Rollup runs inside each package we can just get the name of the current
 * package we are bundling.
 */
const { name } = require(path.join(process.cwd(), "package.json"));

/**
 * Helper function to reformat package names (like `@esri/rest-request`) into
 * nice names for the global namespace like `EsriRestRequest`.
 */
function formatModuleName(name) {
  return _.startCase(`Esri${_.startCase(name.replace("@esri/", ""))}`).replace(
    /\s/g,
    ""
  );
}

/**
 * Now we need to discover all the `@esri/rest-*` package names so we can create
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
 * window object when neither AMD or CommonJS is being used.
 */
const globals = packageNames.reduce(
  (globals, p) => {
    globals[p] = formatModuleName("@esri/rest-request");
    return globals;
  },
  {
    "isomorphic-fetch": "",
    "isomorphic-form-data": "FormData",
    "es6-promise": "Promise"
  }
);

/**
 * Rollup will not bundle these modules into the final build. Users will be
 * expected to install the peer dependencies (for Common JS), map the package
 * names for AMD or include the dependencies in <script> tags in the proper order.
 */
const external = [
  "isomorphic-fetch",
  "isomorphic-form-data",
  "es6-promise"
].concat(packageNames);

/**
 * Now we can export the Rollup config!
 */
export default {
  entry: "./src/index.ts",
  dest: `./dist/umd/${name.replace("@esri/", "")}.umd.js`,
  format: "umd",
  sourceMap: true,
  context: "window",
  moduleName: formatModuleName(name),
  plugins: [
    typescript({
      tsconfig: "../../tsconfig.json",
      include: ["src/**/*.ts+(|x)"],
      exclude: ["src/**/*.test.ts+(|x)"]
    }),
    json(),
    resolve({
      browser: true
    }),
    commonjs(),
    uglify(),
    filesize()
  ],
  globals,
  external
};
