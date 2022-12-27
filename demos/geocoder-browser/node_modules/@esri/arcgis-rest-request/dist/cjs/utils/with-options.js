"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withOptions = void 0;
/**
 * Allows you to wrap individual methods with a default set of request options. This is useful to avoid setting the same option more then once and allows for interacting and setting defaults in a functional manner.
 *
 * ```js
 * import { withOptions } from "@esri/arcgis-rest-request";
 * import { queryFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const queryTrails = withOptions({
 *   url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0/"}, queryFeatures);
 *
 * queryTrails({
 *   where: "ELEV_FT > 1000"
 * }).then(result);
 *
 * const queryTrailsAsUser = withOptions({
 *   authentication: ArcGISIdentityManager
 * }, queryTrails);
 *
 * queryTrailsAsUser({
 *   where: "TRL_NAME LIKE '%backbone%'"
 * }).then(result);
 * ```
 *
 * @param defaultOptions The options to pass into to the `func`.
 * @param func Any function that accepts anything extending `IRequestOptions` as its last parameter.
 * @returns A copy of `func` with the `defaultOptions` passed in as defaults.
 */
function withOptions(defaultOptions, func) {
    return (...args) => {
        const options = typeof args[args.length - 1] === "object"
            ? Object.assign(Object.assign({}, defaultOptions), args.pop()) : defaultOptions;
        return func(...[...args, options]);
    };
}
exports.withOptions = withOptions;
//# sourceMappingURL=with-options.js.map