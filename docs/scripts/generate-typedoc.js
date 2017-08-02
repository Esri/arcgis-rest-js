const { spawn } = require("child_process");
const { join } = require("path");

const modules = ["arcgis-core"];

modules.forEach(module => {
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
