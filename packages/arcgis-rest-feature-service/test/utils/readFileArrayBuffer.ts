import { isBrowser, isNode } from "../../../../scripts/test-helpers.js";

// create empty buffer type according to test environment
export const readEnvironmentEmptyArrayBuffer = () => {
  if (isBrowser) {
    return new ArrayBuffer(8);
  }
  if (isNode) {
    return Buffer.from([]);
  }
};

// create arrayBuffer from file according to test environment
export const readEnvironmentFileToArrayBuffer = async (filePath: string) => {
  if (isBrowser) {
    const pbf = await fetch(filePath);
    return await pbf.arrayBuffer();
  }
  if (isNode) {
    const fs = await import("fs");
    return fs.readFileSync(filePath);
  }
};

export const readEnvironmentFileToJSON = async (filePath: string) => {
  if (isBrowser) {
    const response = await fetch(filePath);
    return await response.json();
  }
  if (isNode) {
    const fs = await import("fs");
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
};
