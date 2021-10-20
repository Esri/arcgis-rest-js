export interface ILayer {
  /** A unique identifying string for the layer. */
  id: any;
  /** Layer name */
  name?: string;
  /** Optional string containing the item ID of the service if it's registered on ArcGIS Online or your organization's portal. */
  itemId?: string;
  /** Indicates the layer type */
  layerType: string;
  /** Integer property used to determine the maximum scale at which the layer is displayed. */
  maxScale?: number;
  /** Integer property used to determine the minimum scale at which the layer is displayed. */
  minScale?: number;
  /** The degree of transparency applied to the layer on the client side, where 0 is full transparency and 1 is no transparency. */
  opacity?: number;
  /** Boolean property indicating whether to display in the legend. */
  showLegend?: boolean;
  /** A user-friendly string title for the layer that can be used in a table of contents. */
  title?: string;
  /**
   * Deprecated, use layerType instead.
   * @deprecated
   */
  type?: string;
  /** Boolean property determining whether the layer is initially visible in the web map. */
  visibility?: boolean;
  /** The URL to the layer. Not applicable to all layer types. */
  url?: string;
}

/**
 * Very generic structure representing the return value from the
 * /arcgis/rest/admin/services/<service-name>/FeatureServer?f=json response
 */
 export interface IServiceInfo extends Record<string, unknown> {
  adminServiceInfo: {
    name: string;
    type: string;
    status: string;
    database: {
      datasource: {
        name: string;
      };
    };
  };
  layers: Record<string, unknown>[];
}

/**
 * Individual View Source entry
 */

 export interface IViewServiceSource {
  name: string;
  type: string;
  url: string;
  serviceItemId: string;
}

/**
 * Response from the /sources end-point of a view service
 */
export interface IViewServiceSources {
  currentVersion: number;
  services: IViewServiceSource[];
}