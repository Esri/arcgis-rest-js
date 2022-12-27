const { check, BlorkError } = require("../../lib/exports");

describe("Grouped types", () => {
	test("Grouped types pass correctly", () => {
		expect(check("a", "(str | num)")).toBe(undefined);
		expect(check(123, "(str | num)")).toBe(undefined);
		expect(check("A", "(str & upper) | (num & int)")).toBe(undefined);
		expect(check(123, "(str & upper) | (num & int)")).toBe(undefined);
		expect(check([1, "a"], "(str | num)[]")).toBe(undefined);
		expect(check({ a: 1, b: "b" }, "{(str|num)}")).toBe(undefined);
		expect(check({ a: 1, b: "b" }, "({str|num})")).toBe(undefined);
	});
	test("Grouped types fail correctly", () => {
		expect(() => check(true, "(str | num)")).toThrow(TypeError);
		expect(() => check(true, "(str & upper) | (num & int)")).toThrow(TypeError);
		expect(() => check([1, "a", true], "(str | num)[]")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(true, "(str | num)")).toThrow(/Must be string or finite number/);
		expect(() => check(true, "(str & upper) | (num & int)")).toThrow(
			"Must be (string and UPPERCASE string) or (finite number and integer)"
		);
		expect(() => check([1, "a", true], "(str | num)[]")).toThrow(
			"Must be plain array containing (string or finite number)"
		);
		expect(() => check([1, "a", true], "!(str | num)[]")).toThrow(
			"Must be plain array containing anything except (string or finite number)"
		);
		expect(() => check([1, "a", true], "(!str | num)[]")).toThrow(
			"Must be plain array containing ((anything except string) or finite number)"
		);
	});
	test("Grouping parentheses can be nested", () => {
		expect(check("abc", "((string))")).toBe(undefined);
		expect(check(123, "(num | (string))")).toBe(undefined);
		expect(check("abc", "(num | (string) | num)")).toBe(undefined);
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "((notexist))")).toThrow(BlorkError);
		expect(() => check(1, "((notexist))")).toThrow("Checker not found");
	});
});
