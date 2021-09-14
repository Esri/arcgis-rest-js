import typescript from "rollup-plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";

import * as path from "path";
import * as fs from "fs";

/**
 * Since Rollup runs inside each package we can just get the current
 * package we are bundling.
 */
const pkg = require(path.join(process.cwd(), "package.json"));

/**
 * and dig out its name.
 */
const { name } = pkg;

/**
 * to construct a copyright banner
 */

const copyright = `/* @preserve
* ${pkg.name} - v${pkg.version} - ${pkg.license}
* Copyright (c) 2017-${new Date().getFullYear()} Esri, Inc.
* ${new Date().toString()}
*/`;

/**
 * The module name will be the name of the global variable used in UMD builds.
 * All exported members of each package will be attached to this global.
 */
const moduleName = "arcgisRest";

/**
 * Now we need to discover all the `@esri/arcgis-rest-*` package names so we can create
 * the `globals` and `externals` to pass to Rollup. @esri/arcgis-rest-fetch is excluded
 * from this because we WANT to bundle it since it only contains references to global
 * fetch
 */
const packageNames = fs
  .readdirSync(path.join(__dirname, "packages"))
  .filter((p) => p[0] !== ".")
  .filter((p) => p !== "arcgis-rest-fetch")
  .filter((p) => p !== "arcgis-rest-form-data")
  .filter((p) => p !== "arcgis-rest-types")
  .map((p) => {
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

const baseConfig = {
  input: "./src/index.ts",
  context: "window",
  inlineDynamicImports: true
};

const baseOutput = {
  sourcemap: true,
  banner: copyright,
  name: moduleName,
  extend: true // causes this module to extend the global specified by `moduleName`
};

const basePlugins = function () {
  return [
    typescript({
      target: "ES2017" // force typescript compile target
    }),
    nodeResolve()
  ];
};

const productionPlugins = function () {
  return [
    filesize(),
    terser({
      format: {
        comments: function (node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == "comment2") {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        }
      }
    })
  ];
};

const packageName = name.replace("@esri/arcgis-rest-", "");

const umdConfig = {
  ...baseConfig,
  output: {
    file: `./dist/bundled/${packageName}.umd.js`,
    format: "umd",
    ...baseOutput,
    globals
  },
  external: packageNames,
  plugins: [...basePlugins()]
};

const umdMinConfig = {
  ...baseConfig,
  output: {
    file: `./dist/bundled/${packageName}.umd.min.js`,
    format: "umd",
    ...baseOutput,
    globals
  },
  external: packageNames,
  plugins: [...basePlugins(), ...productionPlugins()]
};

const esmConfig = {
  ...baseConfig,
  output: {
    file: `./dist/bundled/${packageName}.esm.js`,
    format: "es",
    ...baseOutput,
    globals: name === "arcgis-rest-request" ? undefined : globals
  },
  external: name === "arcgis-rest-request" ? undefined : packageNames,
  plugins: [...basePlugins()]
};

const esmMinConfig = {
  ...baseConfig,
  output: {
    file: `./dist/bundled/${packageName}.esm.min.js`,
    format: "es",
    ...baseOutput,
    globals: name === "arcgis-rest-request" ? undefined : globals
  },
  external: name === "arcgis-rest-request" ? undefined : packageNames,
  plugins: [...basePlugins(), ...productionPlugins()]
};

export default [umdConfig, umdMinConfig, esmConfig, esmMinConfig];
