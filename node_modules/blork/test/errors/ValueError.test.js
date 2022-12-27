const { ValueError } = require("../../lib/exports");

// Tests.
describe("ValueError()", () => {
	describe("Default message", () => {
		test("Return correct error with default message (named function)", () => {
			function abc() {
				const e = new ValueError();
				expect(e).toHaveProperty("name", "ValueError");
				expect(e).toHaveProperty("message", "abc(): Invalid value");
				expect(e).not.toHaveProperty("value");
			}
			abc();
		});
		test("Return correct error with default message (named function)", () => {
			(() => {
				const e = new ValueError();
				expect(e).toHaveProperty("name", "ValueError");
				expect(e).toHaveProperty("message", "Invalid value");
				expect(e).not.toHaveProperty("value");
			})();
		});
	});
	describe("Message", () => {
		test("Return correct error with message only (named function)", () => {
			function abc() {
				const e = new ValueError("Message");
				expect(e).toHaveProperty("name", "ValueError");
				expect(e).toHaveProperty("message", "abc(): Message");
				expect(e).not.toHaveProperty("value");
			}
			abc();
		});
		test("Return correct error with message only (named function)", () => {
			(() => {
				const e = new ValueError("Message");
				expect(e).toHaveProperty("name", "ValueError");
				expect(e).toHaveProperty("message", "Message");
				expect(e).not.toHaveProperty("value");
			})();
		});
	});
	describe("Value", () => {
		test("Return correct error with message and value (named function)", () => {
			function abc() {
				const e = new ValueError("Reason", 123);
				expect(e).toHaveProperty("name", "ValueError");
				expect(e).toHaveProperty("message", "abc(): Reason (received 123)");
				expect(e).toHaveProperty("value", 123);
			}
			abc();
		});
		test("Return correct error with message and value (anonymous function)", () => {
			(() => {
				const e = new ValueError("Reason", 123);
				expect(e).toHaveProperty("message", "Reason (received 123)");
				expect(e).toHaveProperty("value", 123);
			})();
		});
	});
});
