import browserSync from "browser-sync";
import { join, resolve, dirname } from "path";
import getPackages from "./get-package-json.js";
import yargs from "yargs";
const args = yargs(process.argv).argv;

(async () => {
  const cwd = process.cwd();
  const packages = await getPackages();
  const __dirname = dirname(new URL(import.meta.url).pathname);
  const packageFolders = packages.map(({ name }) => {
    return {
      route: `/${name}`,
      dir: resolve(join(__dirname, "../", "node_modules", name))
    };
  });

  browserSync.create().init({
    port: 8080,
    server: cwd,
    serveStatic: [...packageFolders],
    https: args.https !== "false"
  });
})();
