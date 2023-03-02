import fetchMock from "fetch-mock";
import {
  getUserContent,
  IUserContentResponse,
  IUserContentRequestOptions
} from "../../src/items/content.js";

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("getContent", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("Authenticated methods", () => {
    const authentication = new ArcGISIdentityManager({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      username: "moses",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    const mockResponse: IUserContentResponse = {
      username: "geemike",
      total: 20,
      start: 1,
      num: 2,
      nextStart: 3,
      items: [
        {
          id: "1qwe",
          owner: "geemike",
          tags: [],
          created: 0,
          modified: 0,
          numViews: 0,
          size: 10,
          title: "Test Title #1",
          type: "CSV"
        },
        {
          id: "2asd",
          owner: "geemike",
          tags: [],
          created: 0,
          modified: 0,
          numViews: 0,
          size: 10,
          title: "Test Title #2",
          type: "CSV"
        }
      ],
      folders: [
        {
          username: "geemike",
          id: "ba07",
          title: "testing",
          created: 1576264694000
        }
      ]
    };

    it("should get the user content defaulting the start and num parameters", (done) => {
      fetchMock.once("*", mockResponse);

      const requestOptions: IUserContentRequestOptions = {
        owner: "geemike",
        authentication
      };

      getUserContent(requestOptions)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${requestOptions.owner}?f=json&start=1&num=10&token=fake-token`
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should get the user content using the supplied start and num parameters", (done) => {
      fetchMock.once("*", mockResponse);

      const requestOptions: IUserContentRequestOptions = {
        owner: "geemike",
        start: 2,
        num: 1,
        authentication
      };

      getUserContent(requestOptions)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${requestOptions.owner}?f=json&start=2&num=1&token=fake-token`
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should get the user content using the authenticated username", (done) => {
      fetchMock.once("*", mockResponse);

      const requestOptions: IUserContentRequestOptions = {
        start: 2,
        num: 1,
        authentication
      };

      getUserContent(requestOptions)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${authentication.username}?f=json&start=2&num=1&token=fake-token`
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should get the user content using the supplied folderId", (done) => {
      fetchMock.once("*", mockResponse);

      const requestOptions: IUserContentRequestOptions = {
        folderId: "ba07",
        start: 2,
        num: 1,
        authentication
      };

      getUserContent(requestOptions)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${authentication.username}/${requestOptions.folderId}?f=json&start=2&num=1&token=fake-token`
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });
});
