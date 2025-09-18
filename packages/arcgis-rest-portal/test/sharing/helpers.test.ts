/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getSharingUrl, getUserMembership } from "../../src/sharing/helpers.js";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing.js";
import {
  GroupOwnerResponse,
  GroupNoAccessResponse
} from "./share-item-with-group.test.js";
import { isItemOwner } from "../../src/sharing/helpers.js";

describe("sharing helpers ::", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("getUserMembership ::", () => {
    it("should return none if group could not be fetched", (done) => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/tb6?f=json&token=fake-token",
        GroupNoAccessResponse
      );
      getUserMembership({
        id: "ignoreme",
        groupId: "tb6",
        authentication: MOCK_USER_SESSION
      })
        .then((result) => {
          console.log("result", result);
          console.log("fetchMock", fetchMock.lastCall());
          expect(fetchMock.done()).toBeTruthy();
          expect(result).toBe("none", "should return none");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should request the group and return the member type", (done) => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/tb6?f=json&token=fake-token",
        GroupOwnerResponse
      );
      getUserMembership({
        id: "ignoreme",
        groupId: "tb6",
        authentication: MOCK_USER_SESSION
      })
        .then((result) => {
          expect(fetchMock.done()).toBeTruthy();
          expect(result).toBe("owner", "should return owner");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    describe("isItemOwner ::", () => {
      it("should use the username from the session if none is passed", () => {
        expect(
          isItemOwner({
            id: "3ef",
            owner: "casey",
            authentication: MOCK_USER_SESSION
          })
        ).toBe(false);

        expect(
          isItemOwner({
            id: "3ef",
            owner: "jsmith",
            authentication: MOCK_USER_SESSION
          })
        ).toBe(true);
      });
    });

    describe("getSharingUrl ::", () => {
      it("should use the username from the session if none is passed", () => {
        expect(
          getSharingUrl({
            id: "3ef",
            owner: "casey",
            authentication: MOCK_USER_SESSION
          })
        ).toBe(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/share"
        );
      });
    });
  });
});
