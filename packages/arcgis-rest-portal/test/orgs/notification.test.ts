import fetchMock from "fetch-mock";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

import {
  createOrgNotification,
  ICreateOrgNotificationOptions
} from "../../src/orgs/notification.js";

function createUsernames(start: number, end: number): string[] {
  const usernames = [];

  for (let i = start; i < end; i++) {
    usernames.push(`username${i}`);
  }

  return usernames;
}

describe("create-org-notification", () => {
  const MOCK_AUTH = new ArcGISIdentityManager({
    clientId: "clientId",
    redirectUri: "https://example-app.com/redirect-uri",
    token: "fake-token",
    tokenExpires: TOMORROW,
    refreshToken: "refreshToken",
    refreshTokenExpires: TOMORROW,
    username: "casey",
    password: "123456",
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  beforeEach(() => {
    fetchMock.restore();
  });
  it("should send multiple requests for a long user array", (done) => {
    const requests = [createUsernames(0, 25), createUsernames(25, 35)];

    const responses = [{ success: true }, { success: true }];

    fetchMock.post("*", (url, options) => {
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/createNotification"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("subject", "Attention"));
      expect(options.body).toContain(encodeParam("message", "This is a test"));
      expect(options.body).toContain(
        encodeParam("notificationChannelType", "email")
      );
      expect(options.body).toContain(
        encodeParam("users", requests.shift().join(","))
      );

      return responses.shift();
    });

    const params: ICreateOrgNotificationOptions = {
      users: createUsernames(0, 35),
      subject: "Attention",
      message: "This is a test",
      notificationChannelType: "email",
      authentication: MOCK_AUTH
    };

    createOrgNotification(params)
      .then((result) => {
        expect(requests.length).toEqual(0);
        expect(responses.length).toEqual(0);
        expect(result.success).toEqual(true);
        expect(result.errors).toBeUndefined();
        done();
      })
      .catch((error) => fail(error));
  });

  it("should return request failure", (done) => {
    const responses = [
      { success: true },
      {
        error: {
          code: 400,
          messageCode: "ORG_9001",
          message: "error message for creating org notification"
        }
      }
    ];

    fetchMock.post("*", () => responses.shift());

    const params: ICreateOrgNotificationOptions = {
      users: createUsernames(0, 30),
      subject: "Attention",
      message: "This is a test",
      notificationChannelType: "email",
      authentication: MOCK_AUTH
    };

    createOrgNotification(params)
      .then((result) => {
        expect(responses.length).toEqual(0);
        expect(result.success).toEqual(false);

        expect(result.errors.length).toEqual(1);

        const errorA = result.errors[0];
        expect(errorA.url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/portals/self/createNotification"
        );
        expect(errorA.code).toEqual("ORG_9001");
        expect(errorA.originalMessage).toEqual(
          "error message for creating org notification"
        );

        const errorAOptions: any = errorA.options;
        expect(errorAOptions.params.users).toEqual(createUsernames(25, 30));
        done();
      })
      .catch((error) => fail(error));
  });

  it("should not send any request for zero-length username array", (done) => {
    const params: ICreateOrgNotificationOptions = {
      message: "This won't get sent",
      subject: "Attention",
      notificationChannelType: "email",
      users: [],
      authentication: MOCK_AUTH
    };
    fetchMock.post("*", () => 200);
    createOrgNotification(params)
      .then((result) => {
        console.log("result", result);
        console.log("fetchMock", fetchMock.lastCall());
        expect(fetchMock.called()).toEqual(false);
        expect(result.success).toEqual(true);
        expect(result.errors).toBeUndefined();

        done();
      })
      .catch((error) => fail(error));
  });
});
