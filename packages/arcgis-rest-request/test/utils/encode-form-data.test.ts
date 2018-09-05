/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeFormData } from "../../src/utils/encode-form-data";
import {
  requiresFormData,
  processParams
} from "../../src/utils/process-params";
import { attachmentFile } from "../../../arcgis-rest-feature-service/test/attachments.test";

describe("encodeFormData", () => {
  it("should encode in form data for multipart file requests", () => {
    const binaryObj = attachmentFile();

    const formData = encodeFormData({ binary: binaryObj });
    expect(formData instanceof FormData).toBeTruthy();

    const data = formData as FormData;
    if (data.get) {
      expect(data.get("binary") instanceof File).toBeTruthy();
      expect((data.get("binary") as File).name).toBe("foo.txt");
    }
  });

  it("should encode in form data for multipart blob requests", () => {
    const binaryObj =
      typeof Blob !== "undefined"
        ? new Blob([], {
            type: "text/plain"
          })
        : Buffer.from("");

    const formData = encodeFormData({ binary: binaryObj });
    expect(formData instanceof FormData).toBeTruthy();

    const data = formData as FormData;
    if (data.get) {
      expect(data.get("binary") instanceof File).toBeTruthy();
      expect((data.get("binary") as File).name).toBe("binary");
    }
  });

  it("should encode as query string for basic types", () => {
    const dateValue = 1471417200000;

    // null, undefined, function are excluded. If you want to send an empty key you need to send an empty string "".
    // See https://github.com/Esri/arcgis-rest-js/issues/18
    const params = {
      myArray1: new Array(8),
      myArray2: [1, 2, 4, 16],
      myArray3: [{ a: 1, b: 2 }, { c: "abc" }],
      myDate: new Date(dateValue),
      myFunction: () => {
        return 3.1415;
      },
      myBoolean: true,
      myString: "Hello, world!",
      myEmptyString: "",
      myNumber: 380
    };

    expect(requiresFormData(params)).toBeFalsy();

    const formData = processParams(params);
    expect(typeof formData).toBe("object");
    expect(formData.myArray1).toBe(",,,,,,,");
    expect(formData.myArray2).toBe("1,2,4,16");
    expect(formData.myArray3).toBe('[{"a":1,"b":2},{"c":"abc"}]');
    expect(formData.myDate).toBe(dateValue);
    expect(formData.myBoolean).toBeTruthy();
    expect(formData.myString).toBe("Hello, world!");
    expect(formData.myEmptyString).toBe("");
    expect(formData.myNumber).toBe(380);

    const encodedFormData = encodeFormData(params);
    expect(typeof encodedFormData).toBe("string");
    expect(encodedFormData).toBe(
      "myArray1=%2C%2C%2C%2C%2C%2C%2C&" +
        "myArray2=1%2C2%2C4%2C16&" +
        "myArray3=%5B%7B%22a%22%3A1%2C%22b%22%3A2%7D%2C%7B%22c%22%3A%22abc%22%7D%5D&" +
        "myDate=1471417200000&" +
        "myBoolean=true&" +
        "myString=Hello%2C%20world!&" +
        "myEmptyString=&" +
        "myNumber=380"
    );
  });

  it("should switch to form data if any item is not a basic type", () => {
    const dateValue = 1471417200000;
    const file = attachmentFile();
    if (!file.name) {
      // The file's name is used for adding files to a form, so supply a name when we're in a testing
      // environment that doesn't support File (attachmentFile creates a File with the name "foo.txt"
      // if File is supported and a file stream otherwise)
      file.name = "foo.txt";
    }

    // null, undefined, function are excluded. If you want to send an empty key you need to send an empty string "".
    // See https://github.com/Esri/arcgis-rest-js/issues/18
    const params = {
      myArray1: new Array(8),
      myArray2: [1, 2, 4, 16],
      myArray3: [{ a: 1, b: 2 }, { c: "abc" }],
      myDate: new Date(dateValue),
      myFunction: () => {
        return 3.1415;
      },
      myBoolean: true,
      myString: "Hello, world!",
      myEmptyString: "",
      myNumber: 380,
      file
    };

    expect(requiresFormData(params)).toBeTruthy();

    const formData = processParams(params);
    expect(typeof formData).toBe("object");
    expect(formData.myArray1).toBe(",,,,,,,");
    expect(formData.myArray2).toBe("1,2,4,16");
    expect(formData.myArray3).toBe('[{"a":1,"b":2},{"c":"abc"}]');
    expect(formData.myDate).toBe(dateValue);
    expect(formData.myBoolean).toBeTruthy();
    expect(formData.myString).toBe("Hello, world!");
    expect(formData.myEmptyString).toBe("");
    expect(formData.myNumber).toBe(380);
    expect(typeof formData.file).toBe("object");

    const encodedFormData = encodeFormData(params);
    expect(encodedFormData instanceof FormData).toBeTruthy();
  });
});
