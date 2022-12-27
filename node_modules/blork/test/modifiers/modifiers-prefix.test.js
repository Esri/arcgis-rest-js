const { check, BlorkError } = require("../../lib/exports");

describe("Prefix types", () => {
	test("Prefix types pass correctly", () => {
		expect(check(123, "age: num")).toBe(undefined);
		expect(check(123, "age: return num")).toBe(undefined);
		expect(check(123, "age: num+")).toBe(undefined);
		expect(check(123, "age: 123")).toBe(undefined);
		expect(check(123, "age: num{122,124}")).toBe(undefined);
		expect(check({ real: 123 }, "age: { 'real': 123 }")).toBe(undefined);
	});
	test("Prefix types fail correctly", () => {
		expect(() => check(123, "name: str")).toThrow(TypeError);
		expect(() => check(123, "name: return str")).toThrow(TypeError);
		expect(() => check("", "name: str+")).toThrow(TypeError);
		expect(() => check(123, "age: 124")).toThrow(TypeError);
		expect(() => check(123, "age: num{121,122}")).toThrow(TypeError);
		expect(() => check({ real: 123 }, "age: { 'real': 124 }")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(123, "name: str")).toThrow("name: Must be string (received 123)");
		expect(() => check(123, "name: return str")).toThrow("name: Must return string (received 123)");
		expect(() => check("", "name: str+")).toThrow('name: Must be non-empty string (received "")');
		expect(() => check(123, "age: 124")).toThrow("age: Must be 124 (received 123)");
		expect(() => check(123, "age: num{121,122}")).toThrow(
			"age: Must be finite number with size between 121 and 122"
		);
		expect(() => check({ real: 123 }, "age: { 'real': 124 }")).toThrow("age: Must be plain object");
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "prefix: notexist")).toThrow(BlorkError);
		expect(() => check(1, "prefix: notexist")).toThrow("Checker not found");
	});
});
