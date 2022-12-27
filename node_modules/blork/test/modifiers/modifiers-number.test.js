const { check } = require("../../lib/exports");

describe("Number literal types", () => {
	test("Number literal types pass correctly", () => {
		expect(check(1234, "1234")).toBe(undefined);
		expect(check(123.456, "123.456")).toBe(undefined);
	});
	test("Number literal types fail correctly", () => {
		expect(() => check(123, "1234")).toThrow(TypeError);
		expect(() => check("def", "1234")).toThrow(TypeError);
		expect(() => check(false, "1234")).toThrow(TypeError);
		expect(() => check(123, "123.456")).toThrow(TypeError);
		expect(() => check("def", "123.456")).toThrow(TypeError);
		expect(() => check(false, "123.456")).toThrow(TypeError);
	});
	test("Correct error message", () => {
		expect(() => check(11111, "222")).toThrow(/Must be 222/);
		expect(() => check(11111, "123.456")).toThrow(/Must be 123\.456/);
	});
});
