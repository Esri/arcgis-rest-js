const unnestedSplit = require("../../lib/helpers/unnestedSplit");

// Tests.
describe("unnestedSplit()", () => {
	test("Splits strings correcly", () => {
		expect(unnestedSplit("str|num", "|")).toEqual(["str", "num"]);
		expect(unnestedSplit("str|num|bool", "|")).toEqual(["str", "num", "bool"]);
		expect(unnestedSplit("str & num", "&")).toEqual(["str", "num"]);
		expect(unnestedSplit("str & num & bool", "&")).toEqual(["str", "num", "bool"]);
		expect(unnestedSplit("(str) & (num)", "&")).toEqual(["(str)", "(num)"]);
		expect(unnestedSplit("(str) & (num) & (bool)", "&")).toEqual(["(str)", "(num)", "(bool)"]);
		expect(unnestedSplit("(str & bool) & (num)", "&")).toEqual(["(str & bool)", "(num)"]);
		expect(unnestedSplit("num | {str & truthy} | str & num", "&")).toEqual(["num | {str & truthy} | str", "num"]);
	});
	test("Splits correctly for empty strings", () => {
		expect(unnestedSplit("&&&", "&")).toEqual(["", "", "", ""]);
	});
	test("Returns false for strings that can't be split", () => {
		expect(unnestedSplit("str", "&")).toBe(false);
		expect(unnestedSplit("(str & num)", "&")).toBe(false);
	});
});
