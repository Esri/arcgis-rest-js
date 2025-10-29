import { defineConfig } from "vite";
import {
  nodeConfig,
  browserHeadedConfig,
  browserHeadlessConfig
} from "./vitest.projects.ts";

export default defineConfig({
  test: {
    projects: [nodeConfig, browserHeadedConfig, browserHeadlessConfig]
  }
});
