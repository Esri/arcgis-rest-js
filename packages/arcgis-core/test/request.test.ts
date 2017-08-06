import { request, FormData } from "../src/index";
import * as fetchMock from "fetch-mock";
import { SharingRestInfo } from "./mocks/sharing-rest-info";
import { WebMapAsText } from "./mocks/webmap";

describe("request()", () => {
  it("should make a basic POST request", () => {
    const paramsSpy = spyOn(FormData.prototype, "append");

    fetchMock.once("*", SharingRestInfo);

    request("https://www.arcgis.com/sharing/rest/info")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(response).toEqual(SharingRestInfo);
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request", () => {
    fetchMock.once("*", SharingRestInfo);

    request(
      "https://www.arcgis.com/sharing/rest/info",
      {},
      {
        httpMethod: "GET"
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=json");
        expect(options.method).toBe("GET");
        expect(response).toEqual(SharingRestInfo);
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request for text", () => {
    fetchMock.once("*", WebMapAsText);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      { f: "text" },
      {
        httpMethod: "GET"
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data?f=text"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(WebMapAsText);
      })
      .catch(e => {
        fail(e);
      });
  });
});
