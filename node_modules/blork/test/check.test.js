const { ValueError, BlorkError, check } = require("../lib/exports");

// Tests.
describe("check()", () => {
	describe("type", () => {
		test("Throw BlorkError if type is not string", () => {
			expect(() => check(1, 1)).toThrow(BlorkError);
			expect(() => check(1, 1)).toThrow("check(): type: Must be string (received 1)");
			expect(() => check(1, true)).toThrow(BlorkError);
			expect(() => check(1, null)).toThrow(BlorkError);
			expect(() => check(1, undefined)).toThrow(BlorkError);
			expect(() => check(1)).toThrow(BlorkError);
		});
		test("String types pass correctly", () => {
			expect(check(1, "num")).toBe(undefined);
			expect(check(1, "number")).toBe(undefined);
			expect(check("a", "str")).toBe(undefined);
			expect(check("a", "string")).toBe(undefined);
		});
		test("Throw BlorkError if string type does not exist", () => {
			expect(() => check(1, "checkerthatdoesnotexist")).toThrow(BlorkError);
			// Must contain name of bad checker.
			expect(() => check(1, "checkerthatdoesnotexist")).toThrow("checkerthatdoesnotexist");
		});
	});
	describe("error", () => {
		test("Error class defaults to ValueError", () => {
			expect(() => check(123, "str")).toThrow(ValueError);
			expect(() => check(123, "str")).toThrow("Must be string (received 123)");
		});
		test("Error class can be altered by setting error argument", () => {
			class MyError extends Error {}
			expect(() => check(123, "str", MyError)).toThrow(MyError);
			expect(() => check(123, "str", MyError)).toThrow("Must be string (received 123)");
		});
		test("BlorkError if error is not function", () => {
			expect(() => check(123, "str", "notafunction")).toThrow(BlorkError);
			expect(() => check(123, "str", "notafunction")).toThrow(
				'check(): error: Must be function (received "notafunction")'
			);
		});
	});
});
