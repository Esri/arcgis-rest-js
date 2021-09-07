#!/usr/bin/node

/**
 * Creates packages.jsons in the different dist folders to hint the correct module system to node.
 *
 * Inspired by: https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html
 */
import { writeFile } from "fs/promises";
import { join } from "path";

writeFile(
  join(process.cwd(), "dist", "esm", "package.json"),
  JSON.stringify({ type: "module" }, null, 2)
);

writeFile(
  join(process.cwd(), "dist", "cjs", "package.json"),
  JSON.stringify({ type: "commonjs" }, null, 2)
);
