const { check } = require("../../lib/exports");

// Tests.
describe("arraylike/arguments checker", () => {
	test("Works with empty arguments objects", () => {
		(function () {
			expect(check(arguments, "arraylike")).toBe(undefined);
		})();
	});
	test("Works with non-empty arguments objects", () => {
		(function () {
			expect(check(arguments, "arraylike")).toBe(undefined);
		})("abc", "abc");
		(function () {
			expect(check(arguments, "arraylike")).toBe(undefined);
		})("abc", 123, false);
	});
	test("Works with arraylike objects", () => {
		expect(check({ length: 5 }, "arraylike")).toBe(undefined);
	});
	test("Fails if length is not positive integer", () => {
		expect(() => check({ length: 1.5 }, "arraylike")).toThrow(TypeError);
		expect(() => check({ length: -10 }, "arraylike")).toThrow(TypeError);
		expect(() => check({ length: Number.MAX_SAFE_INTEGER + 10 }, "arraylike")).toThrow(TypeError);
	});
});
