/**
 * Creates packages.jsons in the different dist folders to hint the correct module system to Node.
 *
 * Inspired by: https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html
 */
import fs from "fs";
import { join } from "path";

const { writeFile, access } = fs.promises;
const esmBuildFolder = join(process.cwd(), "dist", "esm");

access(esmBuildFolder)
  .then(() => {
    writeFile(
      join(esmBuildFolder, "package.json"),
      JSON.stringify({ type: "module" }, null, 2)
    );
  })
  .catch(() => {
    // fail silently no ESM build folder was found.
  });

const cjsBuildFolder = join(process.cwd(), "dist", "cjs");

access(cjsBuildFolder)
  .then(() => {
    writeFile(
      join(cjsBuildFolder, "package.json"),
      JSON.stringify({ type: "commonjs" }, null, 2)
    );
  })
  .catch(() => {
    // fail silently no CJS build folder was found.
  });
