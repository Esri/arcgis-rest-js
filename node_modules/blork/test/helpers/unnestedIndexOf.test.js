const { BlorkError } = require("../../lib/exports");
const unnestedIndexOf = require("../../lib/helpers/unnestedIndexOf");

// Tests.
describe("unnestedIndexOf()", () => {
	test("Finds indexes correctly", () => {
		expect(unnestedIndexOf("str & num", "&")).toBe(4);
		expect(unnestedIndexOf("str & num & bool", "&", 5)).toBe(10);
		expect(unnestedIndexOf("(str) & (num)", "&")).toBe(6);
		expect(unnestedIndexOf("(str) & (num) & (bool)", "&", 7)).toBe(14);
		expect(unnestedIndexOf("(str & bool) & (num)", "&")).toBe(13);
		expect(unnestedIndexOf("num | {str & truthy} | str & num", "&")).toBe(27);
		expect(unnestedIndexOf('"abc"|"dave"', "|")).toBe(5);
		expect(unnestedIndexOf('"abc" | "dave"', "|")).toBe(6);
	});
	test("Returns -1 for unfound indexes correctly", () => {
		expect(unnestedIndexOf("str", "&")).toBe(-1);
		expect(unnestedIndexOf("(str & num)", "&")).toBe(-1);
		expect(unnestedIndexOf("num | '&' | str", "&")).toBe(-1);
		expect(unnestedIndexOf('num | "&" | str', "&")).toBe(-1);
		expect(unnestedIndexOf("num | {str & truthy} | str", "&")).toBe(-1);
	});
	test("Throws BlorkError if nesting is invalid", () => {
		expect(() => unnestedIndexOf("{ ( & } )", "&")).toThrow(BlorkError);
		expect(() => unnestedIndexOf("[ { & ] }", "&")).toThrow(BlorkError);
		expect(() => unnestedIndexOf("( [ & ) ]", "&")).toThrow(BlorkError);
	});
});
