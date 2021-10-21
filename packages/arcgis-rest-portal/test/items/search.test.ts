/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { searchItems } from "../../src/items/search";

import { SearchResponse, BigSearchResponse } from "../mocks/items/search";
import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { SearchQueryBuilder } from "../../src/util/SearchQueryBuilder";

describe("search", () => {
  afterEach(fetchMock.restore);

  it("should make a simple, single search request", (done) => {
    fetchMock.once("*", SearchResponse);

    searchItems("DC AND typekeywords:hubSiteApplication")
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a simple, single search request with a builder", (done) => {
    fetchMock.once("*", SearchResponse);
    const expectedParam = "DC AND typekeywords:hubSiteApplication";
    const q = new SearchQueryBuilder()
      .match("DC")
      .and()
      .match("hubSiteApplication")
      .in("typekeywords");
    searchItems(q)
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `https://www.arcgis.com/sharing/rest/search?f=json&q=${encodeURIComponent(
            expectedParam
          )}`
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should take num, start, sortField, sortOrder and construct the request", (done) => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      q: "DC AND typekeywords:hubSiteApplication",
      num: 12,
      start: 22,
      sortField: "title",
      sortOrder: "desc",
      searchUserAccess: "groupMember",
      searchUserName: "casey",
      foo: "bar", // this one should not end up on the url
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication&num=12&start=22&sortField=title&sortOrder=desc&searchUserAccess=groupMember&searchUserName=casey"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
  it("should take filter, countFields, countSize and construct the request", (done) => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      q: "DC",
      countFields: "tags, type",
      countSize: 15,
      filter: `title:"Some Exact Title"`,
      sortOrder: "desc",
      foo: "bar", // this one should not end up on the url
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC&sortOrder=desc&filter=title%3A%22Some%20Exact%20Title%22&countFields=tags%2C%20type&countSize=15"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should take categories, categoryFilters and construct the request", (done) => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      q: "DC",
      categories: "/Region/US,/Forest",
      categoryFilters: "ocean",
      foo: "bar", // this one should not end up on the url
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC&categories=%2FRegion%2FUS%2C%2FForest&categoryFilters=ocean"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass through other requestOptions at the same time", (done) => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      q: "DC AND typekeywords:hubSiteApplication",
      num: 12,
      start: 22,
      sortField: "title",
      sortOrder: "desc",
      httpMethod: "POST",
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/search");
        expect(options.body).toContain(
          "q=DC%20AND%20typekeywords%3AhubSiteApplication&num=12&start=22&sortField=title&sortOrder=desc"
        );
        expect(options.method).toBe("POST");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass through other requestOptions at the same time with a builder", (done) => {
    fetchMock.once("*", SearchResponse);
    const expectedParam = "DC AND typekeywords:hubSiteApplication";
    const q = new SearchQueryBuilder()
      .match("DC")
      .and()
      .match("hubSiteApplication")
      .in("typekeywords");
    searchItems({
      q,
      num: 12,
      start: 22,
      sortField: "title",
      sortOrder: "desc",

      httpMethod: "POST",
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/search");
        expect(options.body).toContain(encodeURIComponent(expectedParam));
        expect(options.method).toBe("POST");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should mixin generic params with the search form", (done) => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      q: "DC AND typekeywords:hubSiteApplication",
      num: 12,
      start: 22,
      sortField: "title",
      sortOrder: "desc",
      params: {
        foo: "bar",
      },
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&foo=bar&q=DC%20AND%20typekeywords%3AhubSiteApplication&num=12&start=22&sortField=title&sortOrder=desc"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should provide a nextPage() method to fetch the next page", (done) => {
    fetchMock.once("*", BigSearchResponse);

    searchItems("DC AND typekeywords:hubSiteApplication")
      .then((r) => {
        expect(fetchMock.called()).toEqual(true);
        const [url]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication"
        );
        if (r.nextPage) {
          fetchMock.once("*", BigSearchResponse);

          r.nextPage()
            .then(() => {
              const [nextUrl]: [string, RequestInit] = fetchMock.lastCall("*");

              expect(nextUrl).toEqual(
                "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication&start=2"
              );

              done();
            })
            .catch((e) => {
              fail(e);
            });
        } else {
          fail("search result did not have a nextPage() function");
        }
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should provide a nextSearch() method to fetch the next page when using options", (done) => {
    fetchMock.once("*", BigSearchResponse);

    searchItems({ q: "DC AND typekeywords:hubSiteApplication" })
      .then((r) => {
        expect(fetchMock.called()).toEqual(true);
        const [url]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication"
        );
        if (r.nextPage) {
          fetchMock.once("*", BigSearchResponse);

          r.nextPage()
            .then(() => {
              const [nextUrl]: [string, RequestInit] = fetchMock.lastCall("*");

              expect(nextUrl).toEqual(
                "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication&start=2"
              );

              done();
            })
            .catch((e) => {
              fail(e);
            });
        } else {
          fail("search result did not have a nextPage() function");
        }
      })
      .catch((e) => {
        fail(e);
      });
  });

  describe("Authenticated methods", () => {
    // setup a UserSession to use in all these tests
    const MOCK_USER_SESSION = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
      username: "casey",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest",
    });

    it("search should use the portal and token from Auth Manager", (done) => {
      fetchMock.once("*", SearchResponse);

      searchItems({
        q: "DC AND typekeywords:hubSiteApplication",
        authentication: MOCK_USER_SESSION,
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  }); // auth requests
});
