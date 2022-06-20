import { readFile } from "fs/promises";
import { globby } from "globby";
import pkgDir from "pkg-dir";
import { join, dirname } from "path";

const __dirname = dirname(new URL(import.meta.url).pathname);

/**
 * Returns an object like:
 *
 * {
 *   packageName: package.json contents
 * }
 *
 * For all packages in the packages/* folder.
 */
export default async function getPackages() {
  const rootDir = await pkgDir(__dirname);
  const packageFiles = await globby(join(rootDir, "packages/*/package.json"));
  return Promise.all(
    packageFiles.map((pkgPath) => {
      return readFile(pkgPath).then((pkg) => {
        return JSON.parse(pkg);
      });
    })
  );
}
