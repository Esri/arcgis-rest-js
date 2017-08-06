import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";

export default {
  entry: "src/index.ts",
  plugins: [
    typescript({
      tsconfig: "../../tsconfig.json",
      include: ["src/**/*.ts+(|x)"],
      exclude: ["src/**/*.test.ts+(|x)"]
    }),
    json(),
    resolve(),
    commonjs()
  ],
  targets: [
    { dest: "./dist/node/bundle.cjs.js", format: "cjs", sourceMap: true }
  ]
};
