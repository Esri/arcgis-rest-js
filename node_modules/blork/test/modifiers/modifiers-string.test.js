const { check } = require("../../lib/exports");

describe("String literal types", () => {
	test("String literal types pass correctly", () => {
		expect(check("abc", '"abc"')).toBe(undefined);
		expect(check("abc", "'abc'")).toBe(undefined);
	});
	test("String literal types fail correctly", () => {
		expect(() => check("def", "'abc'")).toThrow(TypeError);
		expect(() => check(123, "'abc'")).toThrow(TypeError);
		expect(() => check(false, "'abc'")).toThrow(TypeError);
		expect(() => check("def", '"abc"')).toThrow(TypeError);
		expect(() => check(123, '"abc"')).toThrow(TypeError);
		expect(() => check(false, '"abc"')).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(true, '"123"')).toThrow('Must be "123"');
		expect(() => check("def", "'abc'")).toThrow('Must be "abc"');
	});
});
