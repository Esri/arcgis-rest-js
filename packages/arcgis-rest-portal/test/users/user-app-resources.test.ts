import * as RequestModule from "@esri/arcgis-rest-request";
import {
  setUserResource,
  getUserResource,
  removeUserResource,
  listUserResources,
  IAddUserResource
} from "../../src/users/user-app-resources";

const RESOURCE = { prop: "value" };

const LISTRESPONSE = {
  total: 2,
  start: 1,
  num: 10,
  nextStart: -1,
  userResources: [
    {
      key: "insights-settings.json",
      clientId: "arcgisInsights",
      created: "Tue Aug 18 20:54:41 UTC 2020",
      size: 131,
      access: "userappprivate"
    },
    {
      key: "hub-user-settings.json",
      clientId: "arcgisonline",
      created: "Tue Apr 27 21:36:26 UTC 2021",
      size: 85,
      access: "userprivateallapps"
    }
  ]
};

const PORTALURL = "https://www.arcgis.com";
const TOKEN = "THEFAKETOKEN";

fdescribe("userAppResources:", () => {
  let requestSpy: jasmine.Spy;

  fdescribe("setUserResource:", () => {
    beforeEach(() => {
      requestSpy = spyOn(RequestModule, "request").and.callFake(
        (url: string) => {
          if (url.includes("/some-resource.json")) {
            return Promise.resolve({ other: "values" });
          } else {
            return Promise.resolve({ success: true });
          }
        }
      );
    });
    it("throws if data is too large", async () => {
      try {
        const resourceOpts: IAddUserResource = {
          data: {
            fake: new Array(200000).fill({ key: "value" })
          },
          key: "some-resource.json",
          access: "userappprivate"
        };
        await setUserResource(resourceOpts, "jsmith", PORTALURL, TOKEN);
      } catch (ex) {
        expect((ex as any).message).toContain("too large to store");
      }
    });
    it("can replace", async () => {
      const resourceOpts: IAddUserResource = {
        data: RESOURCE,
        key: "some-resource.json",
        access: "userappprivate"
      };
      await setUserResource(resourceOpts, "jsmith", PORTALURL, TOKEN, true);
      expect(requestSpy.calls.count()).toBe(1);
      const url = requestSpy.calls.argsFor(0)[0];
      const opts = requestSpy.calls.argsFor(0)[1];
      expect(url).toContain("users/jsmith/addResource");
      expect(opts.params.text).toEqual(JSON.stringify(RESOURCE));
      expect(opts.params.key).toEqual("some-resource.json");
      expect(opts.params.access).toEqual("userappprivate");
      expect(opts.params.token).toEqual(TOKEN);
    });
    it("auto-merges", async () => {
      const resourceOpts: IAddUserResource = {
        data: RESOURCE,
        key: "some-resource.json",
        access: "userappprivate"
      };
      await setUserResource(resourceOpts, "jsmith", PORTALURL, TOKEN);
      expect(requestSpy.calls.count()).toBe(2);
      const url1 = requestSpy.calls.argsFor(0)[0];
      const url2 = requestSpy.calls.argsFor(1)[0];
      const opts = requestSpy.calls.argsFor(1)[1];
      expect(url1).toContain("jsmith/resources/some-resource.json");
      expect(url2).toContain("users/jsmith/addResource");
      expect(opts.params.text).toEqual(
        JSON.stringify({ ...{ other: "values" }, ...RESOURCE })
      );

      expect(opts.params.key).toEqual("some-resource.json");
      expect(opts.params.access).toEqual("userappprivate");
      expect(opts.params.token).toEqual(TOKEN);
    });
  });

  describe("getUserResource:", () => {
    beforeEach(() => {
      requestSpy = spyOn(RequestModule, "request").and.callFake(() => {
        return Promise.resolve(RESOURCE);
      });
    });
    it("construct url", async () => {
      const chk = await getUserResource(
        "jsmith",
        "some-resource.json",
        PORTALURL,
        TOKEN
      );
      const url1 = requestSpy.calls.argsFor(0)[0];
      expect(url1).toContain("jsmith/resources/some-resource.json");
      expect(url1).toContain(`token=${TOKEN}`);
      expect(chk).toEqual(RESOURCE);
    });
  });

  describe("removeUserResource:", () => {
    beforeEach(() => {
      requestSpy = spyOn(RequestModule, "request").and.callFake(() => {
        return Promise.resolve({ success: true });
      });
    });
    it("construct url", async () => {
      await removeUserResource(
        "jsmith",
        "some-resource.json",
        PORTALURL,
        TOKEN
      );
      const url = requestSpy.calls.argsFor(0)[0];
      expect(url).toContain("jsmith/removeResource");
      const opts = requestSpy.calls.argsFor(0)[1];
      expect(opts.params.key).toEqual("some-resource.json");
      expect(opts.params.token).toEqual(TOKEN);
    });
  });

  describe("listUserResources:", () => {
    beforeEach(() => {
      requestSpy = spyOn(RequestModule, "request").and.callFake(() => {
        return Promise.resolve(LISTRESPONSE);
      });
    });

    it("construct url", async () => {
      await listUserResources("jsmith", PORTALURL, TOKEN);
      const url = requestSpy.calls.argsFor(0)[0];
      expect(url).toContain("jsmith/resources");
      expect(url).toContain(`token=${TOKEN}`);
      expect(url).toContain(`returnAllApps=false`);
    });
    it("can return all apps", async () => {
      await listUserResources("jsmith", PORTALURL, TOKEN, true);
      const url = requestSpy.calls.argsFor(0)[0];
      expect(url).toContain("jsmith/resources");
      expect(url).toContain(`token=${TOKEN}`);
      expect(url).toContain(`returnAllApps=true`);
    });
  });
});
