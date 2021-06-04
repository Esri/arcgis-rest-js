/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { determineOwner } from "../../src/items/helpers";
import { UserSession } from "@esri/arcgis-rest-auth/src";

describe("determineOwner()", () => {
  it("should use owner if passed", (done) => {
    determineOwner({
      owner: "Casey",
    })
      .then((owner) => {
        expect(owner).toEqual("Casey");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should use item owner if owner is not passed", (done) => {
    determineOwner({
      item: {
        owner: "Casey",
      },
    })
      .then((owner) => {
        expect(owner).toEqual("Casey");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should lookup owner from authentication if no owner or item owner", (done) => {
    determineOwner({
      authentication: new UserSession({
        token: "ABC",
        username: "Casey",
      }),
    })
      .then((owner) => {
        expect(owner).toEqual("Casey");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should throw an error is the user cannot be determined", (done) => {
    determineOwner({}).catch((e) => {
      expect(e.message).toEqual(
        "Could not determine the owner of this item. Pass the `owner`, `item.owner`, or `authentication` option."
      );
      done();
    });
  });
});
