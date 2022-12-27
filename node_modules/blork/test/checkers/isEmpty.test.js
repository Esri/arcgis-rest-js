const isEmpty = require("../../lib/checkers/isEmpty");

describe("isEmpty()", () => {
	test("Empty things are empty", () => {
		expect(isEmpty(false)).toBe(true);
		expect(isEmpty(null)).toBe(true);
		expect(isEmpty(undefined)).toBe(true);
		expect(isEmpty(0)).toBe(true);
		expect(isEmpty("")).toBe(true);
		expect(isEmpty([])).toBe(true);
		expect(isEmpty({})).toBe(true);
		expect(isEmpty(new Map())).toBe(true);
		expect(isEmpty(new Set())).toBe(true);
	});
	test("Full things are full", () => {
		expect(isEmpty(true)).toBe(false);
		expect(isEmpty(1)).toBe(false);
		expect(isEmpty(-1)).toBe(false);
		expect(isEmpty(0.5)).toBe(false);
		expect(isEmpty("a")).toBe(false);
		expect(isEmpty([1])).toBe(false);
		expect(isEmpty({ a: 1 })).toBe(false);
		expect(isEmpty(new Map([["a", 1]]))).toBe(false);
		expect(isEmpty(new Set(["a"]))).toBe(false);
	});
});
