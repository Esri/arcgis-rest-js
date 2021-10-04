/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  isFederated,
  isOnline,
  getOnlineEnvironment,
  normalizeOnlinePortalUrl,
  canUseOnlineToken
} from "../src/federation-utils.js";

describe("federation utils", () => {
  describe("isOnline()", () => {
    it("should detect if a url is part of ArcGIS Online or not", () => {
      // https standard portal URLs
      expect(isOnline("https://devext.arcgis.com/sharing/rest")).toBe(true);
      expect(isOnline("https://qaext.arcgis.com/sharing/rest")).toBe(true);
      expect(isOnline("https://www.arcgis.com/sharing/rest")).toBe(true);

      // https org portal URLs
      expect(isOnline("https://someorg.mapsdev.arcgis.com/sharing/rest")).toBe(
        true
      );
      expect(isOnline("https://someorg.mapsqa.arcgis.com/sharing/rest")).toBe(
        true
      );
      expect(isOnline("https://someorg.maps.arcgis.com/sharing/rest")).toBe(
        true
      );

      // http standard portal URLs
      expect(isOnline("http://devext.arcgis.com/sharing/rest")).toBe(true);
      expect(isOnline("http://qaext.arcgis.com/sharing/rest")).toBe(true);
      expect(isOnline("http://www.arcgis.com/sharing/rest")).toBe(true);

      // http org portal URLs
      expect(isOnline("http://someorg.mapsdev.arcgis.com/sharing/rest")).toBe(
        true
      );
      expect(isOnline("http://someorg.mapsqa.arcgis.com/sharing/rest")).toBe(
        true
      );
      expect(isOnline("http://someorg.maps.arcgis.com/sharing/rest")).toBe(
        true
      );

      // online service URLs
      expect(
        isOnline(
          "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/PowerPlants/FeatureServer/"
        )
      ).toBe(true);
      expect(
        isOnline(
          "https://services8.arcgis.com/Q1W9j3Lr1BaxMiWi/arcgis/rest/info"
        )
      ).toBe(true);

      // non online URLs
      expect(
        isOnline(
          "https://mapservices.nps.gov/arcgis/rest/services/LandResourcesDivisionTractAndBoundaryService/MapServer"
        )
      ).toBe(false);
    });
  });

  describe("getOnlineEnvironment()", () => {
    it("should fetch the proper ArcGIS Online Environment for a variety of URLs", () => {
      // https standard portal URLs
      expect(
        getOnlineEnvironment("https://devext.arcgis.com/sharing/rest")
      ).toBe("dev");
      expect(
        getOnlineEnvironment("https://qaext.arcgis.com/sharing/rest")
      ).toBe("qa");
      expect(getOnlineEnvironment("https://www.arcgis.com/sharing/rest")).toBe(
        "production"
      );

      // https org portal URLs
      expect(
        getOnlineEnvironment("https://someorg.mapsdev.arcgis.com/sharing/rest")
      ).toBe("dev");
      expect(
        getOnlineEnvironment("https://someorg.mapsqa.arcgis.com/sharing/rest")
      ).toBe("qa");
      expect(
        getOnlineEnvironment("https://someorg.maps.arcgis.com/sharing/rest")
      ).toBe("production");

      // http standard portal URLs
      expect(
        getOnlineEnvironment("http://devext.arcgis.com/sharing/rest")
      ).toBe("dev");
      expect(getOnlineEnvironment("http://qaext.arcgis.com/sharing/rest")).toBe(
        "qa"
      );
      expect(getOnlineEnvironment("http://www.arcgis.com/sharing/rest")).toBe(
        "production"
      );

      // http org portal URLs
      expect(
        getOnlineEnvironment("http://someorg.mapsdev.arcgis.com/sharing/rest")
      ).toBe("dev");
      expect(
        getOnlineEnvironment("http://someorg.mapsqa.arcgis.com/sharing/rest")
      ).toBe("qa");
      expect(
        getOnlineEnvironment("http://someorg.maps.arcgis.com/sharing/rest")
      ).toBe("production");

      // online service URLs
      expect(
        getOnlineEnvironment(
          "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/PowerPlants/FeatureServer/"
        )
      ).toBe("production");

      expect(
        getOnlineEnvironment(
          "https://services8.arcgis.com/Q1W9j3Lr1BaxMiWi/arcgis/rest/info"
        )
      ).toBe("production");

      expect(
        getOnlineEnvironment(
          "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
        )
      ).toBe("production");

      expect(
        getOnlineEnvironment(
          "https://servicesdev.arcgis.com/kRtcltUX8zQf4sFu/arcgis/rest/services/test/FeatureServer"
        )
      ).toBe("dev");

      // non online URLs
      expect(
        getOnlineEnvironment(
          "https://mapservices.nps.gov/arcgis/rest/services/LandResourcesDivisionTractAndBoundaryService/MapServer"
        )
      ).toBe(null);
    });
  });

  describe("normalizeOnlinePortalUrl()", () => {
    it("should normalize portal URLs for ArcGIS Online organzation portals", () => {
      expect(
        normalizeOnlinePortalUrl("https://devext.arcgis.com/sharing/rest")
      ).toBe("https://devext.arcgis.com/sharing/rest");
      expect(
        normalizeOnlinePortalUrl("https://qaext.arcgis.com/sharing/rest")
      ).toBe("https://qaext.arcgis.com/sharing/rest");
      expect(
        normalizeOnlinePortalUrl("https://www.arcgis.com/sharing/rest")
      ).toBe("https://www.arcgis.com/sharing/rest");

      // https org portal URLs
      expect(
        normalizeOnlinePortalUrl(
          "https://someorg.mapsdev.arcgis.com/sharing/rest"
        )
      ).toBe("https://devext.arcgis.com/sharing/rest");
      expect(
        normalizeOnlinePortalUrl(
          "https://someorg.mapsqa.arcgis.com/sharing/rest"
        )
      ).toBe("https://qaext.arcgis.com/sharing/rest");
      expect(
        normalizeOnlinePortalUrl("https://someorg.maps.arcgis.com/sharing/rest")
      ).toBe("https://www.arcgis.com/sharing/rest");

      // non AGOL portals
      expect(
        normalizeOnlinePortalUrl("https://mygis.city.gov/sharing/rest")
      ).toBe("https://mygis.city.gov/sharing/rest");
    });
  });

  describe("canUseOnlineToken()", () => {
    it("should allow using the portal token for requests between online where the domains match", () => {
      expect(
        canUseOnlineToken(
          "https://devext.arcgis.com/sharing/rest",
          "https://servicesdev.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(true);

      expect(
        canUseOnlineToken(
          "https://qaext.arcgis.com/sharing/rest",
          "https://servicesqa.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(true);

      expect(
        canUseOnlineToken(
          "https://www.arcgis.com/sharing/rest",
          "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(true);
    });

    it("should normalize org portals for checking", () => {
      expect(
        canUseOnlineToken(
          "https://myorg.mapsdev.arcgis.com/sharing/rest",
          "https://servicesdev.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(true);

      expect(
        canUseOnlineToken(
          "https://myorg.mapsqa.arcgis.com/sharing/rest",
          "https://servicesqa.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(true);

      expect(
        canUseOnlineToken(
          "https://myorg.maps.arcgis.com/sharing/rest",
          "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(true);
    });

    it("should not allow cross environment token use", () => {
      expect(
        canUseOnlineToken(
          "https://myorg.mapsdev.arcgis.com/sharing/rest",
          "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(false);

      expect(
        canUseOnlineToken(
          "https://myorg.maps.arcgis.com/sharing/rest",
          "https://servicesqa.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0"
        )
      ).toBe(false);
    });

    it("should not allow the online portal token to be sent outside online", () => {
      expect(
        canUseOnlineToken(
          "https://devext.arcgis.com/sharing/rest",
          "https://random.city.gov/arcgis/rest/services/parcels/FeatureServer"
        )
      ).toBe(false);

      expect(
        canUseOnlineToken(
          "https://myorg.maps.arcgis.com/sharing/rest",
          "https://random.city.gov/arcgis/rest/services/parcels/FeatureServer"
        )
      ).toBe(false);
    });
  });

  describe("isFederated", () => {
    it("should allow Online ORG URLs to match Online owning systems URL", () => {
      expect(
        isFederated(
          "https://devext.arcgis.com",
          "https://myorg.mapsdev.arcgis.com/sharing/rest"
        )
      ).toBe(true);

      expect(
        isFederated(
          "https://qaext.arcgis.com",
          "https://myorg.mapsqa.arcgis.com/sharing/rest"
        )
      ).toBe(true);

      expect(
        isFederated(
          "https://www.arcgis.com",
          "https://myorg.maps.arcgis.com/sharing/rest"
        )
      ).toBe(true);

      expect(
        isFederated(
          "https://mygig.city.gov",
          "https://myorg.maps.arcgis.com/sharing/rest"
        )
      ).toBe(false);
    });

    it("should allow https/http mismatches", () => {
      expect(
        isFederated(
          "http://devext.arcgis.com",
          "https://myorg.mapsdev.arcgis.com/sharing/rest"
        )
      ).toBe(true);

      expect(
        isFederated(
          "https://qaext.arcgis.com",
          "http://myorg.mapsqa.arcgis.com/sharing/rest"
        )
      ).toBe(true);

      expect(
        isFederated(
          "http://devext.arcgis.com",
          "https://devext.arcgis.com/sharing/rest"
        )
      ).toBe(true);

      expect(
        isFederated(
          "https://qaext.arcgis.com",
          "http://www.arcgis.com/sharing/rest"
        )
      ).toBe(false);
    });
  });
});
