const isCircular = require("../../lib/checkers/isCircular");

describe("isCircular()", () => {
	test("Non-objects can't contain circular references so return false", () => {
		expect(isCircular(true)).toBe(false);
		expect(isCircular(false)).toBe(false);
		expect(isCircular(null)).toBe(false);
		expect(isCircular(undefined)).toBe(false);
		expect(isCircular(123)).toBe(false);
		expect(isCircular("abc")).toBe(false);
		expect(isCircular(Symbol())).toBe(false);
	});
	test("Objects containing only non-objects return false", () => {
		expect(
			isCircular({
				true: true,
				false: false,
				null: null,
				undef: undefined,
				num: 123,
				str: "abc",
			})
		).toBe(false);
	});
	test("Circular references in objects return true", () => {
		const a = {};
		a.circular = a;
		expect(isCircular(a)).toEqual(true);
		const b = { b: {} };
		b.b.circular = b;
		expect(isCircular(b)).toEqual(true);
		const c = { c: { c: { c: { c: {} } } } };
		c.c.c.c.c.circular = c;
		expect(isCircular(c)).toEqual(true);
	});
	test("Circular references in arrays return true", () => {
		const a = [];
		a[0] = a;
		expect(isCircular(a)).toEqual(true);
		const b = [[[[[[[[]]]]]]]];
		b[0][0][0][0][0][0][0][0] = b;
		expect(isCircular(b)).toEqual(true);
	});
	test("Circular references in functions return true", () => {
		const a = () => {};
		a.circular = a;
		expect(isCircular(a)).toEqual(true);
	});
	test("Mixed circular references in arrays/objects return true", () => {
		const a = [{ a: [{ a: [{ a: [{ a: [{}] }] }] }] }];
		a[0].a[0].a[0].a[0].a[0].circular = a;
		expect(isCircular(a)).toEqual(true);
	});
	test("No circular references in arrays/objects/functions return false", () => {
		const a = [];
		expect(isCircular(a)).toEqual(false);
		const b = [[[[[[[[]]]]]]]];
		expect(isCircular(b)).toEqual(false);
		const c = {};
		expect(isCircular(c)).toEqual(false);
		const d = { d: {} };
		expect(isCircular(d)).toEqual(false);
		const e = { e: { e: { e: { e: {} } } } };
		e.e.e.e.e.circular = c;
		expect(isCircular(e)).toEqual(false);
		const f = [{ f: [{ f: [{ f: [{ f: [{}] }] }] }] }];
		expect(isCircular(f)).toEqual(false);
		const g = () => {};
		expect(isCircular(g)).toEqual(false);
	});
	test("Circular references in objects prototype (not own properties) return false", () => {
		class A {}
		A.prototype.circularClass = A;
		const a = new A();
		A.prototype.circular = a;
		expect(isCircular(a)).toEqual(false);
	});
});
