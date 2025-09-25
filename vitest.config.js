import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: [
      "packages/arcgis-rest-basemap-sessions/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-elevation/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-places/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-demographics/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-geocoding/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-developer-credentials/**/*.{test,spec}.?(c|m)[jt]s?(x)"
    ],
    coverage: {
      enabled: true,
      include: [
        "packages/arcgis-rest-basemap-sessions/src/**/*.{ts,js}",
        "packages/arcgis-rest-elevation/src/**/*.{ts,js}",
        "packages/arcgis-rest-places/src/**/*.{ts,js}",
        "packages/arcgis-rest-demographics/src/**/*.{ts,js}",
        "packages/arcgis-rest-geocoding/src/**/*.{ts,js}",
        "packages/arcgis-rest-developer-credentials/src/**/*.{ts,js}"
      ],
      provider: "istanbul",
      reporter: ["json", "html", "cobertura"],
      reportsDirectory: "./coverage/vitest",
      thresholds: {
        100: true
      }
    }
  }
});
