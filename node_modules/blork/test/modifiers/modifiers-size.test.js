const { check, BlorkError } = require("../../lib/exports");

describe("Size types", () => {
	describe("Exact size types", () => {
		test("Size types pass correctly", () => {
			expect(check("a", "string{1}")).toBe(undefined);
			expect(check("aaaa", "lower{4}")).toBe(undefined);
			expect(check("AAAAA", "upper{5}")).toBe(undefined);
			expect(check({ a: 1, b: 2 }, "obj{2}")).toBe(undefined);
			expect(check([1, "b", true], "array{3}")).toBe(undefined);
			expect(
				check(
					new Map([
						[1, 1],
						[2, 2],
					]),
					"map{2}"
				)
			).toBe(undefined);
			expect(check(new Set([1, 2, "c", 4]), "set{4}")).toBe(undefined);
			expect(check(123, "number{123}")).toBe(undefined);
		});
		test("Size types fail correctly", () => {
			expect(() => check("", "string{1}")).toThrow(TypeError);
			expect(() => check("aa", "string{1}")).toThrow(TypeError);
			expect(() => check("aaa", "lower{4}")).toThrow(TypeError);
			expect(() => check("aaaaa", "lower{4}")).toThrow(TypeError);
			expect(() => check("AAAA", "lower{4}")).toThrow(TypeError);
			expect(() => check({ a: 1 }, "obj{2}")).toThrow(TypeError);
			expect(() => check({ a: 1, b: 2, c: 3 }, "obj{2}")).toThrow(TypeError);
			expect(() => check([1, "b"], "array{3}")).toThrow(TypeError);
			expect(() => check([1, "b", 3, 4], "array{3}")).toThrow(TypeError);
			expect(() => check(new Map([[1, 1]]), "map{2}")).toThrow(TypeError);
			expect(() =>
				check(
					new Map([
						[1, 1],
						[2, 2],
						[3, 3],
					]),
					"map{2}"
				)
			).toThrow(TypeError);
			expect(() => check(new Set([1, 2, 3]), "set{4}")).toThrow(TypeError);
			expect(() => check(new Set([1, 2, 3, 4, 5]), "set{4}")).toThrow(TypeError);
			expect(() => check(122, "number{123}")).toThrow(TypeError);
			expect(() => check(124, "number{123}")).toThrow(TypeError);
		});
		test("Correct error message", () => {
			expect(() => check("a", "str{10}")).toThrow("Must be string with size 10");
			expect(() => check(1, "int{12}")).toThrow("Must be integer with size 12");
		});
	});
	describe("Minimum size types", () => {
		test("Size types pass correctly", () => {
			expect(check("a", "string{1,}")).toBe(undefined);
			expect(check("aa", "string{1,}")).toBe(undefined);
			expect(check("aaaaaaaa", "lower{4,}")).toBe(undefined);
			expect(check("AAAAA", "upper{5,}")).toBe(undefined);
			expect(check({ a: 1, b: 2, c: 3 }, "obj{2,}")).toBe(undefined);
			expect(check([1, "b", true, 4], "array{3,}")).toBe(undefined);
			expect(
				check(
					new Map([
						[1, 1],
						[2, 2],
					]),
					"map{1,}"
				)
			).toBe(undefined);
			expect(check(new Set([1, 2, "c", 4]), "set{4,}")).toBe(undefined);
			expect(check(124, "number{123,}")).toBe(undefined);
		});
		test("Size types fail correctly", () => {
			expect(() => check("", "string{1,}")).toThrow(TypeError);
			expect(() => check("aaa", "lower{4,}")).toThrow(TypeError);
			expect(() => check("AAAAA", "lower{4,}")).toThrow(TypeError);
			expect(() => check({ a: 1 }, "obj{2,}")).toThrow(TypeError);
			expect(() => check([1, "b"], "array{3,}")).toThrow(TypeError);
			expect(() => check(new Map([]), "map{1,}")).toThrow(TypeError);
			expect(() => check(new Set([1, 2]), "set{4,}")).toThrow(TypeError);
			expect(() => check(122, "number{123,}")).toThrow(TypeError);
		});
		test("Correct error message", () => {
			expect(() => check("a", "str{10,}")).toThrow(/Must be string with minimum size 10/);
			expect(() => check(1, "int{12,}")).toThrow(/Must be integer with minimum size 12/);
		});
	});
	describe("Maximum size types", () => {
		test("Size types pass correctly", () => {
			expect(check("a", "string{,2}")).toBe(undefined);
			expect(check("aa", "string{,2}")).toBe(undefined);
			expect(check("aaaaaaaa", "lower{,12}")).toBe(undefined);
			expect(check("AAAAA", "upper{,5}")).toBe(undefined);
			expect(check({ a: 1, b: 2, c: 3 }, "obj{,3}")).toBe(undefined);
			expect(check([1, "b", true, 4], "array{,4}")).toBe(undefined);
			expect(
				check(
					new Map([
						[1, 1],
						[2, 2],
					]),
					"map{,2}"
				)
			).toBe(undefined);
			expect(check(new Set([1, 2, "c", 4]), "set{,4}")).toBe(undefined);
			expect(check(124, "number{,124}")).toBe(undefined);
		});
		test("Size types fail correctly", () => {
			expect(() => check("aa", "string{,1}")).toThrow(TypeError);
			expect(() => check("aaaaa", "lower{,4}")).toThrow(TypeError);
			expect(() => check("AAAA", "lower{,4}")).toThrow(TypeError);
			expect(() => check({ a: 1, b: 2, c: 3 }, "obj{,2}")).toThrow(TypeError);
			expect(() => check([1, "b", 3, 4], "array{,3}")).toThrow(TypeError);
			expect(() => check(new Map([["a", 1]]), "map{,0}")).toThrow(TypeError);
			expect(() => check(new Set([1, 2, 3, 4, 5]), "set{,4}")).toThrow(TypeError);
			expect(() => check(122, "number{,121}")).toThrow(TypeError);
		});
		test("Correct error message", () => {
			expect(() => check("abcdefgh", "str{,6}")).toThrow("Must be string with maximum size 6");
			expect(() => check(123456789, "int{,12}")).toThrow("Must be integer with maximum size 12");
		});
	});
	describe("Minimum and maximum size types", () => {
		test("Size types pass correctly", () => {
			expect(check("a", "string{1,2}")).toBe(undefined);
			expect(check("aa", "string{1,2}")).toBe(undefined);
			expect(check("aaaaa", "lower{4,6}")).toBe(undefined);
			expect(check("AAAAA", "upper{5,6}")).toBe(undefined);
			expect(check({ a: 1, b: 2, c: 3 }, "obj{2,6}")).toBe(undefined);
			expect(check([1, "b", true, 4], "array{3,6}")).toBe(undefined);
			expect(
				check(
					new Map([
						[1, 1],
						[2, 2],
					]),
					"map{1,6}"
				)
			).toBe(undefined);
			expect(check(new Set([1, 2, "c", 4]), "set{4,6}")).toBe(undefined);
			expect(check(124, "number{123,125}")).toBe(undefined);
		});
		test("Size types fail correctly", () => {
			expect(() => check("", "string{1,2}")).toThrow(TypeError);
			expect(() => check("aaa", "string{1,2}")).toThrow(TypeError);
			expect(() => check("aaa", "lower{4,6}")).toThrow(TypeError);
			expect(() => check("AAAAA", "lower{4,6}")).toThrow(TypeError);
			expect(() => check({ a: 1 }, "obj{2,3}")).toThrow(TypeError);
			expect(() => check({ a: 1, b: 2, c: 3, d: 4 }, "obj{2,3}")).toThrow(TypeError);
			expect(() => check([1, "b"], "array{3,4}")).toThrow(TypeError);
			expect(() => check([1, "b", 3, 4, 5], "array{3,4}")).toThrow(TypeError);
			expect(() => check(new Map([["a", 2]]), "map{2,3}")).toThrow(TypeError);
			expect(() =>
				check(
					new Map([
						["a", 2],
						["b", 3],
						["c", 4],
						["d", 5],
					]),
					"map{2,3}"
				)
			).toThrow(TypeError);
			expect(() => check(new Set([1]), "set{2,3}")).toThrow(TypeError);
			expect(() => check(new Set([1, 2, 3, 4]), "set{2,3}")).toThrow(TypeError);
			expect(() => check(122, "number{123,125}")).toThrow(TypeError);
			expect(() => check(126, "number{123,125}")).toThrow(TypeError);
		});
		test("Correct error message", () => {
			expect(() => check("abcdefgh", "str{3,6}")).toThrow("Must be string with size between 3 and 6");
			expect(() => check(1, "int{2,12}")).toThrow("Must be integer with size between 2 and 12");
		});
	});
	test("Other values (boolean, symbol) are not valid", () => {
		expect(() => check(true, "boolean{1,1}")).toThrow(TypeError);
	});
	test("Not valid without at least minimum or maximum", () => {
		expect(() => check(126, "number{}")).toThrow(BlorkError);
		expect(() => check(126, "number{,}")).toThrow(BlorkError);
		expect(() => check(126, "number{a,}")).toThrow(BlorkError);
		expect(() => check(126, "number{,b}")).toThrow(BlorkError);
	});
	test("Unknown checkers throw BlorkError", () => {
		expect(() => check(1, "notexist{0,}")).toThrow(BlorkError);
		expect(() => check(1, "notexist{0,}")).toThrow("Checker not found");
	});
});
