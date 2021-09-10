/**
 * Generate a JSON file containing hash of packages and sha384 hashes of minified umd dist files.
 */
const { join } = require("path");
const { readFile, writeFile } = require("fs");
const { generate } = require("sri-toolbox");
const OUTPUT = join(process.cwd(), "docs", "src", `srihashes.json`);
const version = require(join(process.cwd(), "lerna.json")).version;

const packages = [
  "auth",
  "feature-layer",
  "geocoding",
  "portal",
  "request",
  "routing",
  "service-admin"
];

const promises = [];

packages.forEach(pkg => {
  const package = `@esri/arcgis-rest-${pkg}`;
  const promise = new Promise((resolve, reject) => {
    readFile(`packages/arcgis-rest-${pkg}/dist/umd/${pkg}.umd.min.js`, (err, data) => {
      err ? resolve({
        package,
        hash: false
      }) : resolve({
        package,
        hash: generate({
          algorithms: ["sha384"]
        }, data)
      });
    });
  });
  promises.push(promise);
});

Promise.all(promises).then((res) => {
  const json = {
    version,
    packages: {}
  };
  res.forEach((r) => {
    if (r.hash) json.packages[r.package] = r.hash;
  });
  writeFile(OUTPUT, JSON.stringify(json, null, '  '), "utf8", (err) => {
    if (err) throw err;
  });
}).catch((err) => {
  // make node happy to see `catch()`
});
