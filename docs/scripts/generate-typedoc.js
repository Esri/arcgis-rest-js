const { spawn } = require("child_process");
const { join } = require("path");

const PACKAGES = ["arcgis-core"];

PACKAGES.forEach(module => {
  /**
   * This runs `typedoc` in each of the `PACKAGES` and dumps the results to temp
   * file for Acetate,
   */
  spawn(
    "typedoc",
    [
      "-json",
      join(process.cwd(), "docs", ".typedoc_temp", `${module}.json`),
      "--ignoreCompilerErrors",
      "--exclude",
      '"**/*.test.ts"',
      "--module",
      "common",
      "src"
    ],
    {
      stdio: "inherit",
      cwd: join(process.cwd(), "packages", module)
    }
  );
});
