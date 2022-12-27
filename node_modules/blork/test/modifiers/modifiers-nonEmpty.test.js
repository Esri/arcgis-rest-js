const { check, BlorkError } = require("../../lib/exports");

describe("Non-empty types", () => {
	test("Non-empty types pass correctly", () => {
		expect(check("a", "string+")).toBe(undefined);
		expect(check("a", "str+")).toBe(undefined);
		expect(check("a", "lower+")).toBe(undefined);
		expect(check("A", "upper+")).toBe(undefined);
		expect(check({ a: 1 }, "object+")).toBe(undefined);
		expect(check({ a: 1 }, "obj+")).toBe(undefined);
		expect(check([1], "array+")).toBe(undefined);
		expect(check([1], "arr+")).toBe(undefined);
		expect(check(new Map([[1, 1]]), "map+")).toBe(undefined);
		expect(check(new Set([1]), "set+")).toBe(undefined);
		expect(check(true, "bool+")).toBe(undefined); // Not relevant.
		expect(check(123, "number+")).toBe(undefined); // Not relevant.
	});
	test("Non-empty types fail correctly", () => {
		expect(() => check("", "string+")).toThrow(TypeError);
		expect(() => check("", "str+")).toThrow(TypeError);
		expect(() => check("A", "lower+")).toThrow(TypeError);
		expect(() => check("a", "upper+")).toThrow(TypeError);
		expect(() => check({}, "object+")).toThrow(TypeError);
		expect(() => check({}, "obj+")).toThrow(TypeError);
		expect(() => check([], "array+")).toThrow(TypeError);
		expect(() => check([], "arr+")).toThrow(TypeError);
		expect(() => check(new Map(), "map+")).toThrow(TypeError);
		expect(() => check(new Set(), "set+")).toThrow(TypeError);
		expect(() => check(false, "bool+")).toThrow(TypeError); // Not relevant.
		expect(() => check(0, "number+")).toThrow(TypeError); // Not relevant.
	});
	test("Correct error message", () => {
		expect(() => check(true, "str+")).toThrow("Must be non-empty string");
		expect(() => check([], "arr+")).toThrow("Must be non-empty plain array");
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "notexist+")).toThrow(BlorkError);
		expect(() => check(1, "notexist+")).toThrow("Checker not found");
	});
});
