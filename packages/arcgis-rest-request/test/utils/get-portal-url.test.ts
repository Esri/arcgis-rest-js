import { getPortalUrl, IRequestOptions } from "../../src/index";

describe("getPortalUrl", () => {
  it("should default to arcgis.com", () => {
    const url = getPortalUrl();
    expect(url).toEqual("https://www.arcgis.com/sharing/rest");
  });
  it("should use the portal from authorization if passed", () => {
    const requestOptions = {
      authentication: {
        portal: "https://foo.com/arcgis/sharing/rest",
        getToken() {
          return Promise.resolve("fake");
        }
      }
    };
    const url = getPortalUrl(requestOptions);
    expect(url).toEqual("https://foo.com/arcgis/sharing/rest");
  });
});
