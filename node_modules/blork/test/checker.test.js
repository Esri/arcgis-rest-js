const { checker, BlorkError } = require("../lib/exports");

// Tests.
describe("checker()", () => {
	test("Getting and using a checker works correctly", () => {
		expect(typeof checker("string")).toBe("function");
		expect(checker("string")("abc")).toBe(true);
		expect(checker("string")(123)).toBe(false);
	});
	test("Throw BlorkError if passing a non-string", () => {
		expect(() => checker(123)).toThrow(BlorkError);
		expect(() => checker(false)).toThrow(BlorkError);
	});
	test("Throw BlorkError if asking for non-existant checker", () => {
		expect(() => checker("abc")).toThrow(BlorkError);
		expect(() => checker("abc")).toThrow('checker(): type: Checker not found (received "abc")');
	});
});
