import { defineConfig } from "vite";
import {
  nodeConfig,
  browserHeadedConfig,
  browserHeadlessConfig
} from "./vitest.projects.ts";

export default defineConfig({
  test: {
    projects: [
      nodeConfig,
      browserHeadlessConfig,
      browserHeadedConfig
    ],
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: [
        "packages/**/src/**/*.{ts,js}"
      ],
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
