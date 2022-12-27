export { ApiKey, ApplicationSession, UserSession, exchangeToken, platformSelf, canUseOnlineToken, getOnlineEnvironment, isFederated, isOnline, normalizeOnlinePortalUrl, fetchToken, validateAppAccess, AuthenticationProvider, IApiKeyOptions, ICredential, IOAuth2Options, IPlatformSelfResponse, IAuthenticatedRequestOptions, IUserRequestOptions, IFetchTokenResponse, IAppAccess, IUser } from "@esri/arcgis-rest-request";
import { IArcGISIdentityManagerOptions } from "@esri/arcgis-rest-request";
export interface IUserSessionOptions extends IArcGISIdentityManagerOptions {
}
