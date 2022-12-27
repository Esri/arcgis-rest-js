const modifyChecker = require("../../lib/helpers/modifyChecker");

// Tests.
describe("modifyChecker()", () => {
	test("Checkers with start are created correctly", () => {
		const callback = jest.fn(() => "Yep");
		const checker = () => {};
		const modifiers = [
			{
				start: "++",
				callback,
			},
		];
		const result = modifyChecker(modifiers, "++abc", checker);
		expect(callback).toHaveBeenCalledWith("abc", checker);
		expect(result).toBe("Yep");
	});
	test("Checkers with end are created correctly", () => {
		const callback = jest.fn(() => "Yep");
		const checker = () => {};
		const modifiers = [
			{
				end: "??",
				callback,
			},
		];
		const result = modifyChecker(modifiers, "abc??", checker);
		expect(callback).toHaveBeenCalledWith("abc", checker);
		expect(result).toBe("Yep");
	});
	test("Checkers with different start and end are created correctly", () => {
		const callback = jest.fn(() => "Yep");
		const checker = () => {};
		const modifiers = [
			{
				start: "{",
				end: "}",
				callback,
			},
		];
		const result = modifyChecker(modifiers, "{abc}", checker);
		expect(callback).toHaveBeenCalledWith("abc", checker);
		expect(result).toBe("Yep");
	});
	test("Checkers with same start and end are created correctly", () => {
		const callback = jest.fn(() => "Yep");
		const checker = () => {};
		const modifiers = [
			{
				start: "'",
				end: "'",
				callback,
			},
		];
		const result = modifyChecker(modifiers, "'abc'", checker);
		expect(callback).toHaveBeenCalledWith("abc", checker);
		expect(result).toBe("Yep");
	});
	test("Checkers with split are created correctly", () => {
		const callback = jest.fn(() => "Yep");
		const checker = () => {};
		const modifiers = [
			{
				split: "|",
				callback,
			},
		];
		const result = modifyChecker(modifiers, "abc | def", checker);
		expect(callback).toHaveBeenCalledWith(["abc", "def"], checker);
		expect(result).toBe("Yep");
	});
	test("Checkers with match are created correctly", () => {
		const callback = jest.fn(() => "Yep");
		const checker = () => {};
		const match = /^([a-z]+)<([0-9]+)>/;
		const modifiers = [
			{
				match,
				callback,
			},
		];
		const result = modifyChecker(modifiers, "abc<123>", checker);
		expect(callback).toHaveBeenCalledWith("abc<123>".match(match), checker);
		expect(result).toBe("Yep");
	});
	test("Checkers without any matchy props do nothing", () => {
		const callback = jest.fn(() => "Yep");
		const checker = () => {};
		const modifiers = [
			{
				callback,
			},
		];
		const result = modifyChecker(modifiers, "abc<123>", checker);
		expect(result).toBe(undefined);
	});
});
