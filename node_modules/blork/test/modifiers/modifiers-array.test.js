const { check, BlorkError } = require("../../lib/exports");

describe("Array types", () => {
	test("Array types pass correctly", () => {
		expect(check([1, 2, 3], "num[]")).toBe(undefined);
		expect(check(["a", "b"], "lower[]")).toBe(undefined);
		expect(check([true, false], "bool[]")).toBe(undefined);
	});
	test("Array types fail correctly", () => {
		expect(() => check(true, "num[]")).toThrow(TypeError);
		expect(() => check(false, "num[]")).toThrow(TypeError);
		expect(() => check([1, 2, "c"], "num[]")).toThrow(TypeError);
		expect(() => check(["a", "b", 3], "str[]")).toThrow(TypeError);
		expect(() => check([], "str[]+")).toThrow(TypeError);
		expect(() => check(["a", "b", ""], "str+[]")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(true, "str[]")).toThrow("Must be plain array containing string");
		expect(() => check([], "str[]+")).toThrow("Must be non-empty plain array containing string");
		expect(() => check([], "str[]+|null")).toThrow("Must be (non-empty plain array containing string) or null");
		expect(() => check(["a", "b", ""], "str+[]")).toThrow("Must be plain array containing non-empty string");
		expect(() => check(["a", "b", ""], "(str+|arr+)[]")).toThrow(
			"Must be plain array containing ((non-empty string) or (non-empty plain array))"
		);
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "notexist[]")).toThrow(BlorkError);
		expect(() => check(1, "notexist[]")).toThrow("Checker not found");
	});
});
