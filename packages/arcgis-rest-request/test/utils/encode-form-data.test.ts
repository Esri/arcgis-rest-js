import { encodeFormData } from "../../src/utils/encode-form-data";

describe("encodeFormData", () => {
  it("should encode in form data for multipart requests", () => {
    const binaryObj =
      typeof File !== "undefined"
        ? new File(["foo"], "foo.txt", {
            type: "text/plain"
          })
        : new Buffer("");

    const formData = encodeFormData({ binary: binaryObj });

    expect(formData instanceof FormData).toBeTruthy();
  });
});
