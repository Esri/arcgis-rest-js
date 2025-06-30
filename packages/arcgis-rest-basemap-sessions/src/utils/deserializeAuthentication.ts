import {
  IAuthenticationManager,
  ApiKeyManager,
  ApplicationCredentialsManager,
  ArcGISIdentityManager
} from "@esri/arcgis-rest-request";

/**
 * Deserializes an authentication object into an instance of {@linkcode ApiKeyManager}, {@linkcode ArcGISIdentityManager}, {@linkcode ApplicationCredentialsManager} or a string.
 *
 * @param authentication - The authentication object to deserialize.
 * @returns An instance of IAuthenticationManager or a string representing the authentication type.
 * @throws Error if the authentication type is unsupported.
 */
export function deserializeAuthentication(
  authentication: any
): IAuthenticationManager | string {
  if (typeof authentication === "string") {
    return authentication as string;
  } else if (authentication.type === "ApiKeyManager") {
    return ApiKeyManager.deserialize(JSON.stringify(authentication));
  } else if (authentication.type === "ApplicationCredentialsManager") {
    return ApplicationCredentialsManager.deserialize(
      JSON.stringify(authentication)
    );
  } else if (authentication.type === "ArcGISIdentityManager") {
    return ArcGISIdentityManager.deserialize(JSON.stringify(authentication));
  }
  throw new Error("Unsupported authentication type");
}
