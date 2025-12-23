import { defineConfig } from "vitest/config";
import {
  nodeConfig,
  browserHeadedConfig,
  browserHeadlessConfig,
  nodeLiveConfig,
  browserLiveHeadlessConfig
} from "./vitest.projects.ts";

export default defineConfig({
  test: {
    projects: [
      nodeConfig,
      browserHeadlessConfig,
      browserHeadedConfig,
      nodeLiveConfig,
      //browserLiveHeadlessConfig
    ],
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: ["packages/**/src/**/*.{ts,js}"],
      clean: true,
      cleanOnRerun: true,
      reporter: ["json", "html", "cobertura"],
      reportsDirectory: "./coverage",
      thresholds: {
        100: true
      }
    }
  }
});
