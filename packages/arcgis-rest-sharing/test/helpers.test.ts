/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { getUserMembership } from "../src/helpers";
import { MOCK_USER_SESSION } from "./mocks/sharing";

const GroupOwnerResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "owner"
  }
};

const GroupMemberResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "owner"
  }
};

const GroupNoAccessResponse = {
  error: {
    code: 400,
    messageCode: "COM_0003",
    message: "Group does not exist or is inaccessible.",
    details: [] as any[]
  }
};

describe("sharing helpers ::", () => {
  afterEach(fetchMock.restore);
  describe("getUserMembership ::", () => {
    it("should return nonmember if group could not be fetched", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/tb6?f=json&token=fake-token",
        GroupNoAccessResponse
      );
      getUserMembership({
        groupId: "tb6",
        authentication: MOCK_USER_SESSION
      }).then(result => {
        expect(fetchMock.done()).toBeTruthy();
        expect(result).toBe("nonmember", "should return nonmember");
        done();
      });
    });

    it("should request the group and return the member type", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/tb6?f=json&token=fake-token",
        GroupOwnerResponse
      );
      getUserMembership({
        groupId: "tb6",
        authentication: MOCK_USER_SESSION
      }).then(result => {
        expect(fetchMock.done()).toBeTruthy();
        expect(result).toBe("owner", "should return owner");
        done();
      });
    });
  });
});
