import fetchMock from "fetch-mock";
import {
  exportItem,
  IExportItemResponse,
  IExportItemRequestOptions
} from "../../src/items/export.js";

import { TOMORROW } from "../../../../scripts/test-helpers.js";
import { UserSession, encodeParam } from "@esri/arcgis-rest-request";

describe("exportItem", () => {
  afterEach(fetchMock.restore);

  describe("Authenticated methods", () => {
    const authentication = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
      username: "moses",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    it("should export an item using the supplied owner", (done) => {
      const mockResponse: IExportItemResponse = {
        type: "CSV",
        size: 100,
        jobId: "n0n0",
        exportItemId: "m0m0",
        serviceItemId: "5u4i",
        exportFormat: "CSV"
      };

      fetchMock.once("*", mockResponse);

      const exportOptions: IExportItemRequestOptions = {
        id: "3af",
        owner: "geemike",
        title: "test title",
        exportFormat: "CSV",
        exportParameters: {
          layers: [{ id: 0 }, { id: 1, where: "POP1999 > 100000" }],
          targetSR: {
            wkid: 102100
          }
        },
        authentication
      };
      exportItem(exportOptions)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${exportOptions.owner}/export`
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain("itemId=3af");
          expect(options.body).toContain(encodeParam("exportFormat", "CSV"));
          expect(options.body).toContain(encodeParam("title", "test title"));
          expect(options.body).toContain(
            encodeParam(
              "exportParameters",
              JSON.stringify(exportOptions.exportParameters)
            )
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should export an item falling back to the authenticated owner", (done) => {
      const mockResponse: IExportItemResponse = {
        type: "CSV",
        size: 100,
        jobId: "n0n0",
        exportItemId: "m0m0",
        serviceItemId: "5u4i",
        exportFormat: "CSV"
      };

      fetchMock.once("*", mockResponse);

      exportItem({
        id: "g33M1k3",
        exportFormat: "CSV",
        exportParameters: {
          layers: [{ id: 0 }, { id: 1, where: "POP1999 > 100000" }]
        },
        authentication
      })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${authentication.username}/export`
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });
});
