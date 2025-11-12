import { playwright } from "@vitest/browser-playwright";

export const allTestPackages = [
  "packages/**/*.{test,spec}.?(c|m)[jt]s?(x)",
  "!packages/arcgis-rest-auth/**"
];

export const nodeConfig = {
  test: {
    name: { label: "node", color: "cyan" },
    include: allTestPackages
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
    include: allTestPackages
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
    include: allTestPackages
  }
};
