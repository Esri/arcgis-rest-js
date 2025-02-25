import {
  buildExpirationDateParams,
  slotForKey,
  slotForInvalidationKey
} from "../../src/shared/helpers.js";

describe("helpers", () => {
  describe("buildExpirationDateParams", () => {
    it("should return an object with expiration date 1 params", () => {
      const expiration1 = new Date();
      const expirationDateParams = buildExpirationDateParams({
        apiToken1ExpirationDate: expiration1
      });
      expect(expirationDateParams).toEqual({
        apiToken1ExpirationDate: expiration1
      });
    });

    it("should return an object with expiration date 2 params", () => {
      const expiration2 = new Date();
      const expirationDateParams = buildExpirationDateParams({
        apiToken2ExpirationDate: expiration2
      });
      expect(expirationDateParams).toEqual({
        apiToken2ExpirationDate: expiration2
      });
    });

    it("should return an object with both expiration date 1 and 2 params", () => {
      const expiration1 = new Date();
      const expiration2 = new Date();
      const expirationDateParams = buildExpirationDateParams({
        apiToken1ExpirationDate: expiration1,
        apiToken2ExpirationDate: expiration2
      });
      expect(expirationDateParams).toEqual({
        apiToken1ExpirationDate: expiration1,
        apiToken2ExpirationDate: expiration2
      });
    });

    it("should fill with a default of -1 when requested", () => {
      const expirationDateParams = buildExpirationDateParams(
        {
          apiToken1ExpirationDate: undefined,
          apiToken2ExpirationDate: undefined
        },
        true
      );
      expect(expirationDateParams).toEqual({
        apiToken1ExpirationDate: -1,
        apiToken2ExpirationDate: -1
      });
    });
  });

  describe("slotForKey", () => {
    it("should return 1 for a key that contains AT1 in the proper spot", () => {
      expect(
        slotForKey(
          "AAPTxy6BH1VEsoebNVZXo8HuiIOamKnP-TQacNgPnfkapJPNaUVBDrKX4IISTum7uUKCxustN-33gZ3OIputBuLHf-gu5Bdmw6A4S16pQ5UClfu79W13VBLYaqh3wjRnsCTmO8Q__TiGbXzwote3Z8AcbTMPPQoGqxeV6Z-vr2TQoQHzeLzfJAZzoNrkkTXM9AfYA-dBNrW_eBV9Zl0IYXXNXTR0OQWUZ3PQ5C5OInjh9OU.AT1_G1kye1HB"
        )
      ).toEqual(1);
    });

    it("should return 2 for a key that contains AT2 in the proper spot", () => {
      expect(
        slotForKey(
          "AAPTxy6BH1VEsoebNVZXo8HuiIOamKnP-TQacNgPnfkapJPNaUVBDrKX4IISTum7uUKCxustN-33gZ3OIputBuLHf-gu5Bdmw6A4S16pQ5UClfu79W13VBLYaqh3wjRnsCTmO8Q__TiGbXzwote3Z8AcbTMPPQoGqxeV6Z-vr2TQoQHzeLzfJAZzoNrkkTXM9AfYA-dBNrW_eBV9Zl0IYXXNXTR0OQWUZ3PQ5C5OInjh9OU.AT2_G1kye1HB"
        )
      ).toEqual(2);
    });

    it("should return undefined for a non api key string", () => {
      expect(slotForKey("foo")).toEqual(undefined);
    });
  });

  describe("slotForInvalidationKey", () => {
    it("should return 1 for a full key that contains AT1 in the proper spot", () => {
      expect(
        slotForInvalidationKey(
          "AAPTxy6BH1VEsoebNVZXo8HuiIOamKnP-TQacNgPnfkapJPNaUVBDrKX4IISTum7uUKCxustN-33gZ3OIputBuLHf-gu5Bdmw6A4S16pQ5UClfu79W13VBLYaqh3wjRnsCTmO8Q__TiGbXzwote3Z8AcbTMPPQoGqxeV6Z-vr2TQoQHzeLzfJAZzoNrkkTXM9AfYA-dBNrW_eBV9Zl0IYXXNXTR0OQWUZ3PQ5C5OInjh9OU.AT1_G1kye1HB"
        )
      ).toEqual(1);
    });

    it("should return undefined for a non api key string", () => {
      expect(slotForInvalidationKey("foo")).toEqual(undefined);
    });

    it("should return 1 or 2 if passed", () => {
      expect(slotForInvalidationKey(1)).toEqual(1);
      expect(slotForInvalidationKey(2)).toEqual(2);
      expect(slotForInvalidationKey(3 as any)).toEqual(undefined);
    });
  });
});
