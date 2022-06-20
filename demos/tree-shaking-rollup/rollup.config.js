// rollup.config.js
import nodeResolve from "@rollup/plugin-node-resolve";
import { visualizer } from "rollup-plugin-visualizer";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife"
  },

  plugins: [nodeResolve(), visualizer()]
};
