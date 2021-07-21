import { cleanUrl } from "@esri/arcgis-rest-request";
/**
 * Used to test if a URL is an ArcGIS Online URL
 */
const arcgisOnlineUrlRegex = /^https?:\/\/(\S+)\.arcgis\.com.+/;

/**
 * Used to test if a URL is production ArcGIS Online Portal
 */
const arcgisOnlinePortalRegex = /^https?:\/\/(dev|devext|qa|qaext|www)\.arcgis\.com\/sharing\/rest+/;

/**
 * Used to test if a URL is an ArcGIS Online Organization Portal
 */
const arcgisOnlineOrgPortalRegex = /^https?:\/\/(?:[a-z0-9-]+\.maps(dev|devext|qa|qaext)?)?.arcgis\.com\/sharing\/rest/;

export function isOnline(url: string): boolean {
  return arcgisOnlineUrlRegex.test(url);
}

export function normalizeOnlinePortalUrl(portalUrl: string): string {
  if (!arcgisOnlineUrlRegex.test(portalUrl)) {
    return portalUrl;
  }

  switch (getOnlineEnvironment(portalUrl)) {
    case "dev":
      return "https://devext.arcgis.com/sharing/rest";
    case "qa":
      return "https://qaext.arcgis.com/sharing/rest";
    default:
      return "https://www.arcgis.com/sharing/rest";
  }
}

export function getOnlineEnvironment(url: string): string {
  if (!arcgisOnlineUrlRegex.test(url)) {
    return null;
  }

  const match = url.match(arcgisOnlineUrlRegex);
  const subdomain = match[1].split(".").pop();

  if (subdomain.includes("dev")) {
    return "dev";
  }

  if (subdomain.includes("qa")) {
    return "qa";
  }

  return "production";
}

export function isFederated(
  owningSystemUrl: string,
  portalUrl: string
): boolean {
  const normalizedPortalUrl = cleanUrl(
    normalizeOnlinePortalUrl(portalUrl)
  ).replace(/https?:\/\//, "");

  const normalizedOwningSystemUrl = cleanUrl(owningSystemUrl).replace(
    /https?:\/\//,
    ""
  );

  return new RegExp(normalizedOwningSystemUrl, "i").test(normalizedPortalUrl);
}

export function canUseOnlineToken(
  portalUrl: string,
  requestUrl: string
): boolean {
  const portalIsOnline = isOnline(portalUrl);
  const requestIsOnline = isOnline(requestUrl);
  const portalEnv = getOnlineEnvironment(portalUrl);
  const requestEnv = getOnlineEnvironment(requestUrl);

  if (portalIsOnline && requestIsOnline && portalEnv === requestEnv) {
    return true;
  }

  return false;
}
