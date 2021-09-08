// rollup.config.js
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { visualizer } from "rollup-plugin-visualizer";
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    globals: {
      "formdata-node": "globalThis",
      "node-fetch": "globalThis",
    },
  },
  external: ["formdata-node", "node-fetch"],

  plugins: [
    nodeResolve({}),
    commonjs(),
    babel({
      exclude: "node_modules/**", // only transpile our source code
    }),
    visualizer(),
  ],
};
