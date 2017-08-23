import { serviceInfo } from "../src/index";

// import {
//   SharingRestInfo,
//   SharingRestInfoHTML
// } from "./mocks/sharing-rest-info";
// import { WebMapAsText, WebMapAsJSON } from "./mocks/webmap";

describe("request()", () => {
  it("should make a basic request for metadata from the World Geocoding Service", () => {
    serviceInfo()
      .then(response => {
        // console.log(response);
      })
      .catch(e => {
        fail(e);
      });
  });
});
