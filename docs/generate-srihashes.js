/**
 * Generate a JSON file containing hash of packages and sha384 hashes of minified umd dist files.
 */
const { join, dirname, resolve } = require("path");
const { readFile, writeFile } = require("fs/promises");
const { generate } = require("sri-toolbox");
const OUTPUT = join(process.cwd(), "docs", "src", `srihashes.json`);
const version = require(join(process.cwd(), "lerna.json")).version;
const { promisify } = require("util");

const glob = promisify(require("glob"));

const promises = [];

glob("packages/*/package.json")
  .then((packages) => {
    return Promise.all(
      packages.map((pkgPath) => {
        return readFile(pkgPath).then((pkg) => {
          return JSON.parse(pkg);
        });
      })
    );
  })
  .then((packageJsons) => {
    return Promise.all(
      packageJsons
        .filter((p) => !!p.unpkg)
        .map((pkg) => {
          return readFile(
            resolve(join("packages", pkg.name.replace("@esri/", "")), pkg.unpkg)
          ).then((data) => {
            return {
              pkg,
              hash: generate(
                {
                  algorithms: ["sha384"],
                },
                data
              ),
            };
          });
        })
    );
  })
  .then((res) => {
    const json = {
      version,
      packages: {},
    };
    res.forEach((r) => {
      if (r.hash) json.packages[r.pkg.name] = r.hash;
    });
    writeFile(OUTPUT, JSON.stringify(json, null, "  "), "utf8", (err) => {
      if (err) throw err;
    });
  })
  .catch((err) => {
    console.log(err);
    // make node happy to see `catch()`
  });
