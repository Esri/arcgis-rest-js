const { check, BlorkError } = require("../../lib/exports");

describe("Object types", () => {
	describe("Any checkers", () => {
		test("Object types with any checkers pass correctly", () => {
			expect(check({ a: 1, b: 2, c: 3 }, "{num}")).toBe(undefined);
			expect(check({ a: "A", b: "A" }, "{ upper }")).toBe(undefined);
			expect(check({ aaAA: true, bbBB: false }, "{ camel: bool }")).toBe(undefined);
			expect(check({ "aa-aa": true, "bb-bb": false }, "{ slug: bool }")).toBe(undefined);
			expect(check({ a: 123, b: false }, "{ bool | num }")).toBe(undefined);
			expect(check({ aaa: 123, BBB: false }, "{ lower|upper: bool|num }")).toBe(undefined);
		});
		test("Object types with any checkers fail correctly", () => {
			expect(() => check(true, "{num}")).toThrow(TypeError);
			expect(() => check(false, "{num}")).toThrow(TypeError);
			expect(() => check([1, 2, 3], "{ num }")).toThrow(TypeError);
			expect(() => check({ aaAA: true, bbBB: false }, "{ kebab: bool }")).toThrow(TypeError);
			expect(() => check({ "aa-aa": true, "bb-bb": false }, "{ camel: bool }")).toThrow(TypeError);
		});
		test("Correct error message", () => {
			expect(() => check(true, "{int}")).toThrow("Must be plain object like { string: integer }");
			expect(() => check({ ABC: true }, "{ upper: int }")).toThrow(
				"Must be plain object like { UPPERCASE string: integer }"
			);
			expect(() => check({ ABC: true }, "{ upper: int | str }")).toThrow(
				"Must be plain object like { UPPERCASE string: (integer or string) }"
			);
		});
	});
	describe("Named checkers", () => {
		test("Object types with named checkers pass correctly", () => {
			expect(check({ name: "abc" }, '{ "name": str }')).toBe(undefined);
			expect(check({ name: "abc", age: 123 }, '{ "name": str, "age": int }')).toBe(undefined);
			expect(check({ name: "abc", age: 123 }, '{ "name": str }')).toBe(undefined); // Extra props are allowed.
		});
		test("Object types with any checkers fail correctly", () => {
			expect(() => check({ name: 123 }, '{ "name": str }')).toThrow(TypeError); // Name is wrong.
			expect(() => check({}, '{ "name": str }')).toThrow(TypeError); // Name is missing.
			expect(() => check({ age: 123 }, '{ "name": str, "age": int }')).toThrow(TypeError); // Name is missing.
		});
		test("Correct error message", () => {
			expect(() => check(true, '{ "name": str }')).toThrow(/Must be plain object like { "name": string }/);
			expect(() => check({ ABC: true }, '{ "name": str, "age": int }')).toThrow(
				/Must be plain object like { "name": string, "age": integer }/
			);
		});
	});
	describe("Mixed checkers (any checkers and named checkers together)", () => {
		test("Object types with mixed checkers pass correctly", () => {
			expect(check({ name: "abc", AAA: 1, BBB: 1 }, '{ "name": str, upper: int }')).toBe(undefined);
			expect(check({ NAME: 6, aaa: 1, bbb: 1 }, '{ "NAME": int{5,7}, camel: int }')).toBe(undefined);
		});
		test("Object types with any checkers fail correctly", () => {
			expect(() => check({ name: 123, AAA: 1, BBB: 1 }, '{ "name": str, upper: int }')).toThrow(TypeError); // Name is wrong type.
			expect(() => check({ name: "abc", AAA: "abc" }, '{ "name": int{5,7}, camel: int }')).toThrow(TypeError); // AAA is wrong type.
			expect(() => check({ AAA: "abc" }, '{ "name": int, camel: int }')).toThrow(TypeError); // Name is missing.
		});
		test("Correct error message", () => {
			expect(() => check({}, '{ "name": str, upper: int }')).toThrow(
				/Must be plain object like { "name": string, UPPERCASE string: integer }/
			);
			expect(() => check({}, '{ "name": int, camel: int }')).toThrow(
				/Must be plain object like { "name": integer, camelCase string: integer }/
			);
		});
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "{ string: notexist }")).toThrow(BlorkError);
		expect(() => check(1, "{ string: notexist }")).toThrow("Checker not found");
		expect(() => check(1, "{ notexist: number }")).toThrow(BlorkError);
		expect(() => check(1, "{ notexist: number }")).toThrow("Checker not found");
		expect(() => check(1, "{ notexist }")).toThrow(BlorkError);
		expect(() => check(1, "{ notexist }")).toThrow("Checker not found");
	});
});
