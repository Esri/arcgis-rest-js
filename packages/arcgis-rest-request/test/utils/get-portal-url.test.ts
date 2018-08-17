import { getPortalUrl } from "../../src/index";

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

  it("should use the portal in the requestOptions if passed", () => {
    const requestOptions = {
      portal: "https://bar.com/arcgis/sharing/rest"
    };
    const url = getPortalUrl(requestOptions);
    expect(url).toEqual("https://bar.com/arcgis/sharing/rest");
  });

  it("should prefer the portal in requestOptions if both are present", () => {
    const requestOptions = {
      authentication: {
        portal: "https://foo.com/arcgis/sharing/rest",
        getToken() {
          return Promise.resolve("fake");
        }
      },
      portal: "https://bar.com/arcgis/sharing/rest"
    };
    const url = getPortalUrl(requestOptions);
    expect(url).toEqual("https://bar.com/arcgis/sharing/rest");
  });

  it("should tack on a protocol if none was supplied in requestOptions.portal", () => {
    const requestOptions = {
      authentication: {
        portal: "https://foo.com/arcgis/sharing/rest",
        getToken() {
          return Promise.resolve("fake");
        }
      },
      portal: "bar.com/arcgis/sharing/rest"
    };
    const url = getPortalUrl(requestOptions);
    expect(url).toEqual("https://bar.com/arcgis/sharing/rest");
  });

  it("should not tack on a protocol if an insecure portal url was supplied in requestOptions.portal", () => {
    const requestOptions = {
      authentication: {
        portal: "https://foo.com/arcgis/sharing/rest",
        getToken() {
          return Promise.resolve("fake");
        }
      },
      portal: "http://bar.com/arcgis/sharing/rest"
    };
    const url = getPortalUrl(requestOptions);
    expect(url).toEqual("http://bar.com/arcgis/sharing/rest");
  });
});
