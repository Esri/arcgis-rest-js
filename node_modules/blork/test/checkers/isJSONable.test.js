const isJSONable = require("../../lib/checkers/isJSONable");

describe("isJSONable()", () => {
	test("Primatives are JSON friendly", () => {
		expect(isJSONable(true)).toBe(true);
		expect(isJSONable(false)).toBe(true);
		expect(isJSONable(null)).toBe(true);
		expect(isJSONable(123)).toBe(true);
		expect(isJSONable(-123)).toBe(true);
		expect(isJSONable(1.5)).toBe(true);
		expect(isJSONable(-1.5)).toBe(true);
		expect(isJSONable("")).toBe(true);
		expect(isJSONable("a")).toBe(true);
		expect(isJSONable("abc")).toBe(true);
		expect(isJSONable({ a: true })).toBe(true);
		expect(isJSONable({ a: false })).toBe(true);
		expect(isJSONable({ a: null })).toBe(true);
		expect(isJSONable({ a: 123 })).toBe(true);
		expect(isJSONable({ a: -123 })).toBe(true);
		expect(isJSONable({ a: 1.5 })).toBe(true);
		expect(isJSONable({ a: -1.5 })).toBe(true);
		expect(isJSONable({ a: "" })).toBe(true);
		expect(isJSONable({ a: "a" })).toBe(true);
		expect(isJSONable({ a: "abc" })).toBe(true);
	});
	test("Plain arrays are JSON friendly", () => {
		const arr = [1, 2, 3];
		expect(isJSONable(arr)).toBe(true);
		const deepArr = [[1, 2, 3]];
		expect(isJSONable(deepArr)).toEqual(true);
	});
	test("Plain objects are JSON friendly", () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(isJSONable(obj)).toBe(true);
		const deepObj = { deep: { a: 1, b: 2, c: 3 } };
		expect(isJSONable(deepObj)).toEqual(true);
	});
	test("Undefined is not JSON friendly", () => {
		expect(isJSONable(undefined)).toBe(false);
		expect(isJSONable({ a: undefined })).toBe(false);
	});
	test("Symbols are not JSON friendly", () => {
		expect(isJSONable(Symbol("abc"))).toBe(false);
		expect(isJSONable({ a: Symbol("abc") })).toBe(false);
	});
	test("Infinite numbers are not JSON friendly", () => {
		expect(isJSONable(Infinity)).toBe(false);
		expect(isJSONable(-Infinity)).toBe(false);
		expect(isJSONable(NaN)).toBe(false);
		expect(isJSONable({ a: Infinity })).toBe(false);
		expect(isJSONable({ a: -Infinity })).toBe(false);
		expect(isJSONable({ a: NaN })).toBe(false);
	});
	test("Functions are not JSON friendly", () => {
		expect(isJSONable(() => {})).toBe(false);
		expect(isJSONable({ a: () => {} })).toBe(false);
		expect(isJSONable(String)).toBe(false);
		expect(isJSONable({ a: String })).toBe(false);
	});
	test("Constructors are not JSON friendly", () => {
		expect(isJSONable(new String("abc"))).toBe(false);
		expect(isJSONable({ a: new String("abc") })).toBe(false);
		expect(isJSONable(new Number(123))).toBe(false);
		expect(isJSONable({ a: new Number(123) })).toBe(false);
	});
	test("Class instances are not JSON friendly", () => {
		class Something {}
		class Megarray extends Array {}
		expect(isJSONable(new Something())).toBe(false);
		expect(isJSONable(new Megarray())).toBe(false);
		expect(isJSONable({ a: new Something() })).toBe(false);
		expect(isJSONable({ a: new Megarray() })).toBe(false);
	});
	test("Class instances are not JSON friendly", () => {
		expect(isJSONable(new Date())).toBe(false);
		expect(isJSONable({ a: new Date() })).toBe(false);
		class MyClass {
			toJSON() {
				return "whatever";
			}
		}
		expect(isJSONable(new MyClass())).toBe(false);
		expect(isJSONable({ a: new MyClass() })).toBe(false);
	});
	test("Circular references are not JSON friendly", () => {
		const obj1 = {};
		obj1.circular = obj1;
		expect(isJSONable(obj1)).toBe(false);
		const obj2 = { sub: {} };
		obj2.sub.circular = obj2;
		expect(isJSONable(obj2)).toBe(false);
		const arr1 = [];
		arr1[0] = arr1;
		expect(isJSONable(arr1)).toBe(false);
		const arr2 = [[]];
		arr2[0][0] = arr2;
		expect(isJSONable(arr2)).toBe(false);
	});
});
