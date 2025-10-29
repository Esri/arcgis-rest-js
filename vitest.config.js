import { defineConfig } from "vite";
import {
  nodeConfig,
  browserHeadedConfig,
  browserHeadlessConfig
} from "./vitest.projects.ts";

export default defineConfig({
  test: {
    projects: [nodeConfig, browserHeadlessConfig, browserHeadedConfig],
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: [
        "packages/arcgis-rest-basemap-sessions/src/**/*.{ts,js}",
        "packages/arcgis-rest-elevation/src/**/*.{ts,js}",
        "packages/arcgis-rest-places/src/**/*.{ts,js}",
        "packages/arcgis-rest-demographics/src/**/*.{ts,js}",
        "packages/arcgis-rest-geocoding/src/**/*.{ts,js}",
        "packages/arcgis-rest-routing/src/**/*.{ts,js}",
        "packages/arcgis-rest-feature-service/src/**/*.{ts,js}",
        "packages/arcgis-rest-developer-credentials/src/**/*.{ts,js}",
        "packages/arcgis-rest-portal/src/**/*.{ts,js}",
        "packages/arcgis-rest-request/src/**/*.{ts,js}"
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
