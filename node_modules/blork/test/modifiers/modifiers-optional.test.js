const { check, BlorkError } = require("../../lib/exports");

describe("Optional types", () => {
	test("Optional types pass correctly", () => {
		expect(check(1, "number?")).toBe(undefined);
		expect(check("a", "string?")).toBe(undefined);
		expect(check({}, "object?")).toBe(undefined);
		expect(check(undefined, "number?")).toBe(undefined);
		expect(check(undefined, "string?")).toBe(undefined);
		expect(check(undefined, "object?")).toBe(undefined);
	});
	test("Optional types fail correctly", () => {
		expect(() => check("a", "number?")).toThrow(TypeError);
		expect(() => check(1, "string?")).toThrow(TypeError);
		expect(() => check(1, "object?")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(true, "string?")).toThrow("Must be string or empty");
		expect(() => check("abc", "boolean?")).toThrow("Must be boolean or empty");
		expect(() => check([true], "string?[]")).toThrow("Must be plain array containing (string or empty)");
		expect(() => check([true], "(str | int)?")).toThrow("Must be (string or integer) or empty");
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "notexist?")).toThrow(BlorkError);
		expect(() => check(1, "notexist?")).toThrow("Checker not found");
	});
});
