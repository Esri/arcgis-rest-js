const { check } = require("../../lib/exports");

// Tests.
describe("object checker", () => {
	test("Works with empty objects", () => {
		expect(check({}, "object")).toBe(undefined);
	});
	test("Works with non-empty objects", () => {
		expect(check({ a: 1, b: 2 }, "object")).toBe(undefined);
	});
	test("Fails for superclasses of object", () => {
		class SuperObject extends Object {}
		expect(() => check(new SuperObject(), "object")).toThrow(TypeError);
	});
});
