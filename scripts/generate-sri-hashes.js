/**
 * Generate a JSON file containing hash of packages and sha384 hashes of minified umd dist files.
 */
import { join, resolve } from "path";
import { readFile, writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { generate } from "sri-toolbox";
import { promisify } from "util";
import globCb from "glob";

const OUTPUT = join(process.cwd(), `srihashes.json`);
const VERSION = JSON.parse(readFileSync("package.json")).version;

const glob = promisify(globCb);

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
                  algorithms: ["sha384"]
                },
                data
              )
            };
          });
        })
    );
  })
  .then((res) => {
    const json = {
      version: VERSION,
      packages: {}
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
