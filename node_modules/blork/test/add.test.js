const ValueError = require("../lib/errors/ValueError");
const BlorkError = require("../lib/errors/BlorkError");
const { check, add } = require("../lib/exports");

// Tests.
describe("add()", () => {
	test("Add and run a custom string checker", () => {
		// Define a checker called 'h81739'.
		expect(add("h81739", "str+")).toBeUndefined();

		// Check a passing value.
		expect(check("abc", "h81739")).toBe(undefined);

		// Check a failing value.
		expect(() => check(123, "h81739")).toThrow(ValueError);
		expect(() => check(123, "h81739")).toThrow("Must be h81739 (received 123)");
	});
	test("Add and run a custom function checker (no description)", () => {
		// Define a checker called 'a11218'.
		expect(add("a11218", (v) => typeof v === "string")).toBeUndefined();

		// Check a passing value.
		expect(check("abc", "a11218")).toBe(undefined);

		// Check a failing value.
		expect(() => check(123, "a11218")).toThrow(ValueError);
		expect(() => check(123, "a11218")).toThrow("Must be a11218 (received 123)");
	});
	describe("name", () => {
		test("BlorkError if name is not kebab-case string", () => {
			const func = () => {};
			expect(() => add(123, func, "func")).toThrow(BlorkError);
			expect(() => add("", func, "func")).toThrow(BlorkError);
			expect(() => add("name_name", func, "func")).toThrow(BlorkError);
			expect(() => add("UPPER", func, "func")).toThrow(BlorkError);
			expect(() => add("UPPER", func, "func")).toThrow(
				'add(): name: Must be kebab-case string (received "UPPER")'
			);
		});
		test("BlorkError if same name as existing", () => {
			const func = () => {};
			add("b89441", func, "samename");
			expect(() => add("b89441", func)).toThrow(BlorkError);
			expect(() => add("b89441", func)).toThrow('add(): name: Blork type already exists (received "b89441")');
		});
	});
	describe("checker", () => {
		test("BlorkError if checker is not string or function", () => {
			expect(() => add("z92783", "string")).not.toThrow(BlorkError);
			expect(() => add("k29288", () => true)).not.toThrow(BlorkError);
			expect(() => add("dc63b8", true)).toThrow(BlorkError);
			expect(() => add("dc63b8", true)).toThrow("add(): checker: Must be string or function (received true)");
		});
		test("BlorkError if checker string is not a valid checker", () => {
			expect(() => add("z92783", "nope")).toThrow(BlorkError);
			expect(() => add("k92830", "nope")).toThrow('add(): checker: Checker not found (received "nope")');
		});
	});
	describe("description", () => {
		test("Add and run a custom function checker with description", () => {
			// Define a checker called 'e618e0'.
			expect(add("e618e0", (v) => typeof v === "string", "exactly correct")).toBeUndefined();

			// Check a passing value.
			expect(check("abc", "e618e0")).toBe(undefined);

			// Check a failing value.
			expect(() => check(123, "e618e0")).toThrow(ValueError);
			expect(() => check(123, "e618e0")).toThrow("Must be exactly correct (received 123)");
		});
		test("BlorkError if description is not non-empty string", () => {
			const func = () => {};
			expect(() => add("b89441", func, 123)).toThrow(BlorkError);
			expect(() => add("b89441", func, 123)).toThrow(
				"add(): description: Must be non-empty string (received 123)"
			);
		});
	});
});
