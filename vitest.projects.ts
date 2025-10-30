import { playwright } from "@vitest/browser-playwright";

export const nodeConfig = {
  test: {
    name: { label: "node", color: "cyan" },
    include: [
      "packages/arcgis-rest-basemap-sessions/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-elevation/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-places/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-demographics/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-geocoding/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-routing/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-feature-service/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-developer-credentials/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-portal/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-request/**/*.{test,spec}.?(c|m)[jt]s?(x)"
    ]
  }
};

export const browserHeadlessConfig = {
  test: {
    name: { label: "headless", color: "magenta" },
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        { browser: "chromium" },
        { browser: "firefox" },
        { browser: "webkit" }
      ]
    },
    include: [
      "packages/arcgis-rest-basemap-sessions/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-elevation/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-places/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-demographics/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-geocoding/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-routing/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-feature-service/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-developer-credentials/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-portal/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-request/**/*.{test,spec}.?(c|m)[jt]s?(x)"
    ]
  }
};

export const browserHeadedConfig = {
  test: {
    name: { label: "browser", color: "blue" },
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: "chromium" },
        { browser: "firefox" },
        { browser: "webkit" }
      ]
    },
    include: [
      "packages/arcgis-rest-basemap-sessions/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-elevation/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-places/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-demographics/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-geocoding/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-routing/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-feature-service/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-developer-credentials/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-portal/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/arcgis-rest-request/**/*.{test,spec}.?(c|m)[jt]s?(x)"
    ]
  }
};
