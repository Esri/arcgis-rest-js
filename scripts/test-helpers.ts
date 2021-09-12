/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { File } from "@esri/arcgis-rest-form-data";

export const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

export const YESTERDAY = (function () {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now;
})();

export function attachmentFile(): any {
  return new File(["foo"], "foo.txt", { type: "text/plain" });
}
