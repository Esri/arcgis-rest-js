import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import {
  createGroup,
  IGroupSharingOptions,
  shareItemWithGroup,
  unshareItemWithGroup,
} from "../src";

/**
 * This was created to work through issues Monika ran into
 */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const groupId = "13fa2590ca1141d9b0a9fc544336f90b"; // owned by dev_bas_a_hub_admin
const itemId = "febd892c349d45419cce60f5536870d4"; // owned by chezelle_ba

describe("sharing test harness", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
  });

  describe("user can fav cross-org items", () => {
    // Scenrio failing for Monkia
    xit("chezelle_b can fav cross-org item", async () => {
      const session = factory.getSession("hubBasic", "user");
      // get the user's fav group
      const chezelle_b = await session.getUser();
      const favGroupId = chezelle_b.favGroupId;
      const opts: IGroupSharingOptions = {
        id: itemId,
        owner: "chezelle_ba",
        groupId: favGroupId,
        authentication: session,
      };
      const result = await shareItemWithGroup(opts);
      // this correctly uses the /content/items/{id}/share endpoint

      expect(result).toBeTruthy();
      // need to wait for the index to update else the unshare will early-exit
      await delay(1000);
      // cleanup unshare from fav group
      const result2 = await unshareItemWithGroup(opts);
    });
    xit("chezelle_b can Living Atlas item", async () => {
      const session = factory.getSession("hubBasic", "user");
      // get the user's fav group
      const chezelle_b = await session.getUser();
      const opts: IGroupSharingOptions = {
        id: "b12e8352e6b94547988dd4156a789377", // DEVEXT Living Atlas: USA Soil Map Units
        owner: "esri_environment",
        groupId: chezelle_b.favGroupId,
        authentication: session,
      };
      const result = await shareItemWithGroup(opts);
      // this correctly uses the /content/items/{id}/share endpoint

      expect(result).toBeTruthy();
      // need to wait for the index to update else the unshare will early-exit
      await delay(1000);
      // cleanup unshare from fav group
      const result2 = await unshareItemWithGroup(opts);
    });
    xit("chezelle_b can share cross-org item to group she owns", async () => {
      // NOTE: This flow is prevented in AGO
      // The Add items to Group dialog runs a query which limits to public items or items in the user's org
      // VERIFY: dialog also includes collaboration org ids

      const session = factory.getSession("hubBasic", "user");
      // create a group
      const { group: grp } = await createGroup({
        authentication: session,
        group: {
          title: "HARNESS chezelle_b owned group",
          access: "private",
        },
      });
      // share item to group
      const opts: IGroupSharingOptions = {
        id: itemId,
        owner: "chezelle_ba",
        groupId: grp.id,
        authentication: session,
      };
      const result = await shareItemWithGroup(opts);
      expect(result).toBeTruthy();
      const result2 = await unshareItemWithGroup(opts);
    });
  });

  describe("admin can fav cross-org item", () => {
    xit("admin can fav cross-org item", async () => {
      // Admin in Org A
      // Fav's and Item from Org B
      // that they can "see" b/c of membership in Group in Org A
      // WORKS: and uses /content/items/{id}/share endpoint

      // if user is not in group, they can't see the item, and we get the
      const session = factory.getSession("hubBasic", "admin");
      // get the user's fav group
      const paige_b = await session.getUser();

      const opts: IGroupSharingOptions = {
        id: itemId,
        owner: "chezelle_ba",
        groupId: paige_b.favGroupId,
        authentication: session,
      };
      const result = await shareItemWithGroup(opts);
      expect(result).toBeTruthy();
      // need to wait for the index to update else the unshare will early-exit
      await delay(1000);
      // unshare from fav group
      const result2 = await unshareItemWithGroup(opts);
    });
    xit("Admin can fav Living Atlas item", async () => {
      const session = factory.getSession("hubBasic", "admin");
      // get the user's fav group
      const paige_b = await session.getUser();
      const opts: IGroupSharingOptions = {
        id: "b12e8352e6b94547988dd4156a789377", // DEVEXT Living Atlas: USA Soil Map Units
        owner: "esri_environment",
        groupId: paige_b.favGroupId,
        authentication: session,
      };
      const result = await shareItemWithGroup(opts);
      // this correctly uses the /content/items/{id}/share endpoint

      expect(result).toBeTruthy();
      // need to wait for the index to update else the unshare will early-exit
      await delay(1000);
      // cleanup unshare from fav group
      const result2 = await unshareItemWithGroup(opts);
    });

    fit("monika can fav cross-org item", async () => {
      // if user is not in group, they can't see the item, and we get the
      const session = factory.getSession("monikaDevOrg", "admin");
      // get the user's fav group
      const monika = await session.getUser();

      const opts: IGroupSharingOptions = {
        id: "0fdaa4a7872745ea87d6074673931b94",
        owner: "hosted_data_testing1",
        groupId: monika.favGroupId,
        authentication: session,
      };
      const result = await shareItemWithGroup(opts);
      expect(result).toBeTruthy();
      // need to wait for the index to update else the unshare will early-exit
      await delay(1000);
      // unshare from fav group
      const result2 = await unshareItemWithGroup(opts);
    });
  });
});
