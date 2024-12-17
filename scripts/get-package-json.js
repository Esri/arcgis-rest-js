import { readFile } from "fs/promises";
import { globby } from "globby";
import pkgDir from "pkg-dir";
import { posix } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/');

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
  const rootDir = (await pkgDir(__dirname)).replace(/\\/g, "/");

  const packageFiles = await globby(posix.join(rootDir, "packages/*/package.json"));

  return Promise.all(
    packageFiles.map((pkgPath) => {
      return readFile(pkgPath).then((pkg) => {
        return JSON.parse(pkg);
      });
    })
  );
}
