/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect } from "vitest";
import { determineOwner, decorateThumbnail } from "../../src/items/helpers.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

describe("determineOwner()", () => {
  test("should use owner if passed", async () => {
    const owner = await determineOwner({ owner: "Casey" });
    expect(owner).toEqual("Casey");
  });

  test("should use item owner if owner is not passed", async () => {
    const owner = await determineOwner({ item: { owner: "Casey" } });
    expect(owner).toEqual("Casey");
  });

  test("should lookup owner from authentication if no owner or item owner", async () => {
    const owner = await determineOwner({
      authentication: new ArcGISIdentityManager({
        token: "ABC",
        username: "Casey"
      })
    });
    expect(owner).toEqual("Casey");
  });

  test("should throw an error is the user cannot be determined", async () => {
    await expect(determineOwner({})).rejects.toThrow(
      "Could not determine the owner of this item. Pass the `owner`, `item.owner`, or `authentication` option."
    );
  });
});

describe("decorateThumbnail()", () => {
  test("should return null/undefined if item is null", () => {
    expect(decorateThumbnail(null as any, "https://portal.com")).toBeNull();
    expect(
      decorateThumbnail(undefined as any, "https://portal.com")
    ).toBeUndefined();
  });
});
