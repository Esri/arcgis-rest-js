const { check } = require("../../lib/exports");

// Tests.
describe("integer checkers", () => {
	test("Fails with floats", () => {
		expect(() => check(1.5, "integer")).toThrow(TypeError);
		expect(() => check(1.5, "integer-")).toThrow(TypeError);
		expect(() => check(1.5, "integer+")).toThrow(TypeError);
	});
	test("Works with zero integers", () => {
		expect(check(0, "integer")).toBe(undefined);
		expect(check(0, "integer+")).toBe(undefined);
		expect(check(0, "integer-")).toBe(undefined);
	});
	test("Works with highest allowed integers", () => {
		expect(check(Number.MAX_SAFE_INTEGER, "integer")).toBe(undefined);
		expect(check(Number.MAX_SAFE_INTEGER, "integer+")).toBe(undefined);
		expect(check(0, "integer-")).toBe(undefined);
	});
	test("Works with lowest allowed integers", () => {
		expect(check(Number.MIN_SAFE_INTEGER, "integer")).toBe(undefined);
		expect(check(Number.MIN_SAFE_INTEGER, "integer-")).toBe(undefined);
		expect(check(0, "integer+")).toBe(undefined);
	});
	test("Fails for numbers higher than allowed", () => {
		expect(() => check(Number.MAX_SAFE_INTEGER + 10, "integer")).toThrow(TypeError);
		expect(() => check(Number.MAX_SAFE_INTEGER + 10, "integer+")).toThrow(TypeError);
		expect(() => check(1, "integer-")).toThrow(TypeError);
	});
	test("Fails for numbers lower than allowed", () => {
		expect(() => check(Number.MIN_SAFE_INTEGER - 10, "integer")).toThrow(TypeError);
		expect(() => check(-1, "integer+")).toThrow(TypeError);
		expect(() => check(Number.MIN_SAFE_INTEGER - 10, "integer-")).toThrow(TypeError);
	});
});
