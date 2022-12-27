const debug = require("../helpers/debug");
const stackTrigger = require("../helpers/stackTrigger");

// Constants.
const EMPTY = Symbol("blork/ValueError.EMPTY");

// Regexes.
const R_STARTS_WITH_FUNCTION = /^[a-zA-Z0-9-_.]+\(\): /;

/**
 * ValueError
 *
 * An error type that includes standardised formatting and error debugging.
 * ValueError semantically means "there is a problem with a value that has been passed into the current function".
 */
class ValueError extends TypeError {
	/**
	 * Constructor.
	 * @param {string} message="Invalid value" Message describing what went wrong, e.g. "Must be a string"
	 * @param {mixed} value=EMPTY A value to debug shown at the end of the message, e.g. "Must be string (received 123)"
	 */
	constructor(message, value) {
		// Defaults.
		if (arguments.length < 2) value = EMPTY;
		if (arguments.length < 1) message = "Invalid value";

		// Super.
		super("******");

		// Pin down the cause of the error.
		// This looks through the Error.stack and finds where e.g. check() was actually called.
		const frame = stackTrigger(this.stack, ["check()"]);

		// If there was an error causing function prepend it to the message.
		// e.g. "name" → "MyClass.myFunc(): name"
		/* istanbul ignore else */
		if (frame) {
			// Prepend the calling function name to the message (ignoring anonymous functions and messages that match the regex).
			if (frame.function && !R_STARTS_WITH_FUNCTION.test(message)) message = `${frame.function}: ${message}`;

			// Update file, line, column.
			this.fileName = frame.file;
			this.lineNumber = frame.line;
			this.stack = frame.stack;
		}

		// Save props.
		if (value !== EMPTY) {
			this.value = value;
			this.message = `${message} (received ${debug(value)})`;
		} else {
			this.message = message;
		}
		this.stack = this.stack.replace("******", this.message);

		// Save name as constructor name (e.g. ValueError).
		this.name = this.constructor.name;
	}
}

// Exports.
module.exports = ValueError;
