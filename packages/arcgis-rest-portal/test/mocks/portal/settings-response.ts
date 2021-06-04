/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IPortalSettings } from "../../../src/util/get-portal-settings";

export const PortalSettingsResponse: IPortalSettings = {
  allowedRedirectUris: [],
  authorizedCrossOriginDomains: [],
  canShareBingPublic: false,
  defaultExtent: {
    xmin: -15000000,
    ymin: 2700000,
    xmax: -6200000,
    ymax: 6500000,
    spatialReference: {
      wkid: 102100,
    },
  },
  featuredGroups: [
    {
      title: "Esri Maps and Data",
      owner: "esri",
    },
  ],
  helperServices: {
    geocode: [
      {
        url: "http://geocodeqa.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        northLat: "Ymax",
        southLat: "Ymin",
        eastLon: "Xmax",
        westLon: "Xmin",
        name: "ArcGIS World Geocoding Service",
        batch: true,
        placefinding: true,
        suggest: true,
      },
    ],
    route: {
      url: "http://routeqa.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    closestFacility: {
      url: "http://routeqa.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
  },
  homePageFeaturedContentCount: 12,
  informationalBanner: {
    text: "Wow Check Out This Info Banner!!!",
    bgColor: "#ff0000",
    fontColor: "#ffffff",
    enabled: true,
  },
  showHomePageDescription: false,
};
