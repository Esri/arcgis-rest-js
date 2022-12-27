/* @preserve
* @esri/arcgis-rest-auth - v4.0.2 - Apache-2.0
* Copyright (c) 2017-2022 Esri, Inc.
* Tue Dec 27 2022 09:24:40 GMT-0800 (Pacific Standard Time)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@esri/arcgis-rest-request')) :
  typeof define === 'function' && define.amd ? define(['exports', '@esri/arcgis-rest-request'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arcgisRest = global.arcgisRest || {}, global.arcgisRest));
})(this, (function (exports, arcgisRestRequest) { 'use strict';

  Object.defineProperty(exports, 'ApiKey', {
    enumerable: true,
    get: function () { return arcgisRestRequest.ApiKey; }
  });
  Object.defineProperty(exports, 'ApplicationSession', {
    enumerable: true,
    get: function () { return arcgisRestRequest.ApplicationSession; }
  });
  Object.defineProperty(exports, 'AuthenticationProvider', {
    enumerable: true,
    get: function () { return arcgisRestRequest.AuthenticationProvider; }
  });
  Object.defineProperty(exports, 'IApiKeyOptions', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IApiKeyOptions; }
  });
  Object.defineProperty(exports, 'IAppAccess', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IAppAccess; }
  });
  Object.defineProperty(exports, 'IAuthenticatedRequestOptions', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IAuthenticatedRequestOptions; }
  });
  Object.defineProperty(exports, 'ICredential', {
    enumerable: true,
    get: function () { return arcgisRestRequest.ICredential; }
  });
  Object.defineProperty(exports, 'IFetchTokenResponse', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IFetchTokenResponse; }
  });
  Object.defineProperty(exports, 'IOAuth2Options', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IOAuth2Options; }
  });
  Object.defineProperty(exports, 'IPlatformSelfResponse', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IPlatformSelfResponse; }
  });
  Object.defineProperty(exports, 'IUser', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IUser; }
  });
  Object.defineProperty(exports, 'IUserRequestOptions', {
    enumerable: true,
    get: function () { return arcgisRestRequest.IUserRequestOptions; }
  });
  Object.defineProperty(exports, 'UserSession', {
    enumerable: true,
    get: function () { return arcgisRestRequest.UserSession; }
  });
  Object.defineProperty(exports, 'canUseOnlineToken', {
    enumerable: true,
    get: function () { return arcgisRestRequest.canUseOnlineToken; }
  });
  Object.defineProperty(exports, 'exchangeToken', {
    enumerable: true,
    get: function () { return arcgisRestRequest.exchangeToken; }
  });
  Object.defineProperty(exports, 'fetchToken', {
    enumerable: true,
    get: function () { return arcgisRestRequest.fetchToken; }
  });
  Object.defineProperty(exports, 'getOnlineEnvironment', {
    enumerable: true,
    get: function () { return arcgisRestRequest.getOnlineEnvironment; }
  });
  Object.defineProperty(exports, 'isFederated', {
    enumerable: true,
    get: function () { return arcgisRestRequest.isFederated; }
  });
  Object.defineProperty(exports, 'isOnline', {
    enumerable: true,
    get: function () { return arcgisRestRequest.isOnline; }
  });
  Object.defineProperty(exports, 'normalizeOnlinePortalUrl', {
    enumerable: true,
    get: function () { return arcgisRestRequest.normalizeOnlinePortalUrl; }
  });
  Object.defineProperty(exports, 'platformSelf', {
    enumerable: true,
    get: function () { return arcgisRestRequest.platformSelf; }
  });
  Object.defineProperty(exports, 'validateAppAccess', {
    enumerable: true,
    get: function () { return arcgisRestRequest.validateAppAccess; }
  });

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=auth.umd.js.map
