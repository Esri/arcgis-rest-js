const { check, BlorkError } = require("../../lib/exports");

describe("Inverted types", () => {
	test("Inverted types pass correctly", () => {
		expect(check("abc", "!number")).toBe(undefined);
		expect(check(123, "!string")).toBe(undefined);
		expect(check([], "!object")).toBe(undefined);
		expect(check(NaN, "!number")).toBe(undefined);
		expect(check(123, "!string")).toBe(undefined);
		expect(check({}, "!array")).toBe(undefined);
	});
	test("Inverted types fail correctly", () => {
		expect(() => check("abc", "!string")).toThrow(TypeError);
		expect(() => check(123, "!num")).toThrow(TypeError);
		expect(() => check({}, "!object")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check("abc", "!string")).toThrow("Must be anything except string");
		expect(() => check(true, "!boolean")).toThrow("Must be anything except boolean");
		expect(() => check("abc", "!str+")).toThrow("Must be anything except non-empty string");
		expect(() => check(123, "!(int | str)")).toThrow("Must be anything except (integer or string)");
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "!notexist")).toThrow(BlorkError);
		expect(() => check(1, "!notexist")).toThrow("Checker not found");
	});
});
