const { debug } = require("../../lib/exports");

// Tests.
describe("debug()", () => {
	test("Return correct debug string for strings", () => {
		expect(debug("abc")).toBe('"abc"');
		expect(debug('ab"cd')).toBe('"ab\\"cd"');
		expect(debug('ab"cd"ef')).toBe('"ab\\"cd\\"ef"');
	});
	test("Return correct debug string for numbers", () => {
		expect(debug(123)).toBe("123");
		expect(debug(NaN)).toBe("NaN");
		expect(debug(Infinity)).toBe("Infinity");
		expect(debug(-Infinity)).toBe("-Infinity");
	});
	test("Return correct debug string for primatives", () => {
		expect(debug(null)).toBe("null");
		expect(debug(undefined)).toBe("undefined");
		expect(debug(true)).toBe("true");
		expect(debug(false)).toBe("false");
	});
	test("Return correct debug string for regular expressions", () => {
		expect(debug(/abc/)).toBe("/abc/");
	});
	test("Trim long strings to a reasonable maximum length", () => {
		const str =
			"Could fascination a assigner superwoman fraternal or allow ruling been discoverer. Purveyor funny such sporting to one pointedness spiritual order sculp when universally man? Saint vibrantly now so at its bright irresistibly what see individualize posifit keep up flamboyantly simplified acute sophisticatedly owning your power. Boffo do the blithesome supernal validatory wiggle sol shift in focus like first as much a rah enchantress punctilious too nothing an he. A the jamming composed into wink at (an the cunning peach upon).";
		const debugged = debug(str);
		expect(debugged.length).toBeLessThan(str.length);
	});
	test("Return correct single line debug string for objects", () => {
		expect(debug({})).toBe("{}");
		expect(debug({ a: 1 })).toBe('{ "a": 1 }');
		expect(debug({ a: 1, b: 2, c: 3 })).toBe('{ "a": 1, "b": 2, "c": 3 }');
	});
	test("Return correct multiline debug string for objects", () => {
		// Multiline because over 72 chars in total.
		expect(
			debug({
				a: "Cherished charmer much an hand to jest.",
				b: "Yelp infallibly calmative buff centered.",
				c: "Accommodatingly swain he for did fast.",
			})
		).toBe(`{
	"a": "Cherished charmer much an hand to jest.",
	"b": "Yelp infallibly calmative buff centered.",
	"c": "Accommodatingly swain he for did fast."
}`);
	});
	test("Return correct multiline debug string for array", () => {
		// Multiline because over 72 chars in total.
		expect(
			debug([
				"Cherished charmer much an hand to jest lightly.",
				"Yelp infallibly calmative buff centered.",
				"Accommodatingly swain he for did fast.",
			])
		).toBe(`[
	"Cherished charmer much an hand to jest lightly.",
	"Yelp infallibly calmative buff centered.",
	"Accommodatingly swain he for did fast."
]`);
	});
	test("Return correct debug string for arrays", () => {
		expect(debug([])).toBe("[]");
		expect(debug([1, 2, 3])).toBe("[1, 2, 3]");
		expect(debug([1, [21, 22, 23], 3])).toBe(`[1, [21, 22, 23], 3]`);
	});
	test("Return correct debug string for functions", () => {
		expect(debug(function () {})).toBe("function ()");
		expect(debug(function dog() {})).toBe("dog()");
	});
	test("Return correct debug string for class instances", () => {
		expect(debug(new (class MyClass {})())).toBe("MyClass {}");
		expect(debug(new (class {})())).toBe("anonymous object {}");
	});
	test("Return correct debug string for errors", () => {
		expect(debug(TypeError("My error message"))).toBe('TypeError "My error message"');
		expect(debug(new TypeError("My error message"))).toBe('TypeError "My error message"');
		class MyError extends Error {}
		MyError.prototype.name = "MyError";
		expect(debug(new MyError())).toBe("MyError");
		expect(debug(new MyError("My error message"))).toBe('MyError "My error message"');
		class AnonymousError extends Error {}
		AnonymousError.prototype.name = "";
		expect(debug(new AnonymousError())).toBe("AnonymousError");
		expect(debug(new AnonymousError("My error message"))).toBe('AnonymousError "My error message"');
	});
	test("Return correct debug string for symbols", () => {
		expect(debug(Symbol("abc"))).toBe("Symbol(abc)");
	});
	test("Return correct debug for objects with circular references", () => {
		const obj = {};
		obj.circular = obj;
		expect(debug(obj)).toBe('{ "circular": {↻} }');
	});
	test("Return correct debug for arrays with circular references", () => {
		const arr = [];
		arr[0] = arr;
		expect(debug(arr)).toBe("[[↻]]");
	});
	test("Return correct debug for arrays 3 or more levels deep", () => {
		expect(debug([[]])).toBe("[[]]"); // Two is fine.
		expect(debug([[[]]])).toBe("[[[]]]"); // Three is fine.
		expect(debug([[[1]]])).toBe("[[[1]]]"); // Three is fine.
		expect(debug([[[[1]]]])).toBe("[[[[…]]]]"); // Attempting more than three levels shows …
		expect(debug([[[{}]]])).toBe("[[[{}]]]"); // Attempting more than three levels shows …
		expect(debug([[[{ a: 1 }]]])).toBe("[[[{…}]]]"); // Attempting more than three levels shows …
	});
	test("Return correct debug for objects more than 3 levels deep", () => {
		expect(debug({ a: { a: { a: 1 } } })).toBe('{ "a": { "a": { "a": 1 } } }'); // Three is fine.
		expect(debug({ a: { a: { a: { a: 1 } } } })).toBe('{ "a": { "a": { "a": {…} } } }'); // Attempting more than three levels shows …
		expect(debug({ a: { a: { a: { a: { a: 1 } } } } })).toBe('{ "a": { "a": { "a": {…} } } }'); // Attempting more than three levels shows …
	});
	test("Return correct debug for arguments objects", () => {
		(function () {
			expect(debug(arguments)).toBe('{ "0": "abc", "1": 123, "2": true }');
		})("abc", 123, true);
	});
});
