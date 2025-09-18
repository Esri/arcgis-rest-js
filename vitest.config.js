import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: [
      "packages/arcgis-rest-basemap-sessions/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-demographics/**/*.{test,spec}.?(c|m)[jt]s?(x)"
    ],
    coverage: {
      enabled: true,
      include: [
        "packages/arcgis-rest-basemap-sessions/src/**/*.{ts,js}",
        "packages/arcgis-rest-demographics/src/**/*.{ts,js}"
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
