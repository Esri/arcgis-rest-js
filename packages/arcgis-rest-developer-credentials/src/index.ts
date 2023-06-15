/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./createApiKey.js";
export * from "./updateApiKey.js";
export * from "./getApiKey.js";
export * from "./shared/enum/PRIVILEGE.js";
export * from "./shared/types/appType.js";
export * from "./shared/types/apiKeyType.js";
export * from "./shared/getRegisteredAppInfo.js";
export * from "./shared/registerApp.js";

// Types that are used in this package are re-exported for convenience and
// to make the links work correctly in the documentation pages.
// export type {
//   IPoint,
//   ILocation,
//   IExtent,
//   ISpatialReference
// } from "@esri/arcgis-rest-request";
