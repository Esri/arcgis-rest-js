/* istanbul ignore file */
// Note: currently this is all internal to the package, and we are not exposing
// anything that a user can set... but we need all this to be able to ensure
// that multiple instances of the package can share the same config.

export interface IRequestConfig {
  noCorsDomains: string[];
  crossOriginNoCorsDomains: Record<string, number>;
  pendingNoCorsRequests: PendingRequestCache;
}

export type PendingRequestCache = {
  [key: string]: Promise<void>;
};

/**
 * The default config for the request module. This is used to store
 * the no-cors domains and pending requests.
 */
const DEFAULT_ARCGIS_REQUEST_CONFIG: IRequestConfig = {
  noCorsDomains: [],
  crossOriginNoCorsDomains: {},
  pendingNoCorsRequests: {},
};

const GLOBAL_VARIABLE_NAME = "arcgisRestRequestConfig";

// Set the global variable to the default config if it is not aleady defined
// This is done to ensure that all instances of rest-request work with a single
// instance of the config
if (!(globalThis as any)[GLOBAL_VARIABLE_NAME]) {
  (globalThis as any)[GLOBAL_VARIABLE_NAME] = {
    ...DEFAULT_ARCGIS_REQUEST_CONFIG,
  } as IRequestConfig;
}

// export the settings as immutable consts that read from the global config
export const requestConfig = (globalThis as any)[
  GLOBAL_VARIABLE_NAME
] as IRequestConfig;
