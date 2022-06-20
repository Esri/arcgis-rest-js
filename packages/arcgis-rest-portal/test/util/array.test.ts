/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { chunk } from "../../src/util/array.js";

describe("array.chunk", () => {
  it("should chunk a long array", () => {
    const input = [1, 2, 3, 4];
    const result = chunk(input, 3);
    expect(result).toEqual([[1, 2, 3], [4]]);
  });

  it("should chunk an array with the length proportional to the chunk size", () => {
    const input = [1, 2, 3, 4];
    const result = chunk(input, 2);
    expect(result).toEqual([
      [1, 2],
      [3, 4]
    ]);
  });

  it("should not chunk a short array", () => {
    const input = [1, 2, 3, 4];
    const result = chunk(input, 5);
    expect(result).toEqual([[1, 2, 3, 4]]);
  });

  it("should not chunk a zero-length array", () => {
    const input: number[] = [];
    const result = chunk(input, 5);
    expect(result).toEqual([]);
  });
});
