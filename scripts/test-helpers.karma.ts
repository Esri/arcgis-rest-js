/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";

export const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

export const FIVE_DAYS_FROM_NOW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 5);
  return now;
})();

export const YESTERDAY = (function () {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now;
})();

export const isNode = new Function(
  "try {return this===global;}catch(e){return false;}"
)();

export const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
)();

fetchMock.config.overwriteRoutes = true;
