const BlorkError = require("../../lib/errors/BlorkError");

// Tests.
describe("BlorkError()", () => {
	test("Return correct error with default message", () => {
		expect(new BlorkError()).toHaveProperty("message");
		expect(new BlorkError()).not.toHaveProperty("value");
	});
	test("Return correct error with message only", () => {
		expect(new BlorkError("Message").message).toMatch("Message");
		expect(new BlorkError("Message")).not.toHaveProperty("value");
	});
	test("Return correct error with message and value", () => {
		expect(new BlorkError("Message", 123).message).toMatch("Message (received 123)");
		expect(new BlorkError("Message", 123)).toHaveProperty("value", 123);
	});
});
