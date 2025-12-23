import { playwright } from "@vitest/browser-playwright";

export const testPackages = [
  "packages/**/*.{test,spec}.?(c|m)[jt]s?(x)",
  "!packages/**/*.{test,spec}.live.?(c|m)[jt]s?(x)"
];

export const liveTestPackages = [
  "packages/**/*.{test,spec}.live.?(c|m)[jt]s?(x)"
];

export const nodeConfig = {
  test: {
    name: { label: "node", color: "cyan" },
    include: testPackages
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
    include: testPackages
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
    include: testPackages
  }
};

export const nodeLiveConfig = {
  test: {
    name: "node (LIVE)",
    include: liveTestPackages
  }
};

export const browserHeadlessLiveConfig = {
  test: {
    name: "headless (LIVE)",
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
    include: liveTestPackages
  }
};
