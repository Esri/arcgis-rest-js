/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export {
  ApiKey,
  ApplicationSession,
  UserSession,
  exchangeToken,
  platformSelf,
  canUseOnlineToken,
  getOnlineEnvironment,
  isFederated,
  isOnline,
  normalizeOnlinePortalUrl,
  fetchToken,
  generateToken,
  validateAppAccess,
  AuthenticationProvider,
  IApiKeyOptions,
  ICredential,
  IOAuth2Options,
  IPlatformSelfResponse,
  IAuthenticatedRequestOptions,
  IUserRequestOptions,
  IFetchTokenResponse,
  IGenerateTokenResponse,
  IAppAccess,
  IUser
} from "@esri/arcgis-rest-request";

import { IArcGISIdentityManagerOptions } from "@esri/arcgis-rest-request";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserSessionOptions extends IArcGISIdentityManagerOptions {}
