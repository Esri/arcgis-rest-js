import { defineConfig } from "vitest/config";
import {
  nodeConfig,
  browserHeadedConfig,
  browserHeadlessConfig,
  nodeLiveConfig,
  browserHeadlessLiveConfig
} from "./vitest.projects.ts";

export default defineConfig({
  test: {
    // for dev purposes, comment out a project to remove it from the extension view
    projects: [
      nodeConfig,
      browserHeadlessConfig,
      browserHeadedConfig,
      // nodeLiveConfig,
      // browserHeadlessLiveConfig
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
