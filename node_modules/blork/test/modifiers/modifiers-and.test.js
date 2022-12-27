const { check, BlorkError } = require("../../lib/exports");

describe("AND types", () => {
	test("AND combined types pass correctly", () => {
		expect(check(1, "number & integer")).toBe(undefined);
		expect(check(1, "num & +int")).toBe(undefined);
		expect(check("abc", "str & lower+")).toBe(undefined);
		expect(check("ABC", "str & upper+")).toBe(undefined);
	});
	test("AND combined types fail correctly", () => {
		expect(() => check("a", "number & string")).toThrow(TypeError);
		expect(() => check("a", "number & string")).toThrow(/Must be finite number and string/);
	});
	test("AND and OR combined types combine correctly", () => {
		// `&` has higher precedence than `|`
		expect(check("abc", "string & lower | upper")).toBe(undefined);
		expect(check("ABC", "string & lower | upper")).toBe(undefined);
		expect(() => check("ABCabc", "string & lower | upper")).toThrow(TypeError);
		expect(check("abc", "lower | upper & string")).toBe(undefined);
		expect(check("ABC", "lower | upper & string")).toBe(undefined);
		expect(() => check("ABCabc", "lower | upper & string")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(1, "string & string | string")).toThrow("Must be string and (string or string)");
		expect(() => check(1, "string | string & string")).toThrow("Must be (string or string) and string");
		expect(() => check(1, "{ string } | null")).toThrow("Must be (plain object like { string: string }) or null");
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "notexist & notexist")).toThrow(BlorkError);
		expect(() => check(1, "notexist & notexist")).toThrow("Checker not found");
	});
});
