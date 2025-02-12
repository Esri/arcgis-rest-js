import { buildExpirationDateParams } from "../../src/shared/helpers.js";

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
