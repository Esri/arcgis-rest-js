const { check } = require("../../lib/exports");

// Tests.
describe("array checker", () => {
	test("Works with empty arrays", () => {
		expect(check([1, 2, 3], "array")).toBe(undefined);
	});
	test("Works with non-empty arrays", () => {
		expect(check([1, 2, 3], "array")).toBe(undefined);
	});
	test("Fails for superclasses of Array", () => {
		class SuperArray extends Array {}
		expect(() => check(new SuperArray(), "array")).toThrow(TypeError);
	});
});
