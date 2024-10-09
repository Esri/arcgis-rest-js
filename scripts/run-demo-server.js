import browserSync from "browser-sync";
import { resolve, posix } from "path";
import { fileURLToPath } from "url";
import getPackages from "./get-package-json.js";

(async () => {
  const cwd = process.cwd();
  const packages = await getPackages();
  const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/');
  const packageFolders = packages.map(({ name }) => {
    return {
      route: `/${name}`,
      dir: resolve(posix.join(__dirname, "../", "node_modules", name))
    };
  });

  browserSync.create().init({
    port: 8080,
    server: cwd,
    serveStatic: [...packageFolders],
    https: true
  });
})();
