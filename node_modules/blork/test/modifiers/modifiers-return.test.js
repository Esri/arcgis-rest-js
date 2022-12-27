const { check, BlorkError } = require("../../lib/exports");

describe("Return types", () => {
	test("Return types pass correctly", () => {
		expect(check("a", "return string")).toBe(undefined);
		expect(check(123, "return number")).toBe(undefined);
	});
	test("Return types fail correctly", () => {
		expect(() => check(123, "return string")).toThrow(TypeError);
		expect(() => check("a", "return number")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(123, "return string")).toThrow("Must return string");
		expect(() => check("a", "return number")).toThrow("Must return finite number");
	});
	test("Return type has highest precedence", () => {
		expect(() => check(123, "return str+ | boolean")).toThrow("Must return (non-empty string) or boolean");
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "return notexist")).toThrow(BlorkError);
		expect(() => check(1, "return notexist")).toThrow("Checker not found");
	});
});
