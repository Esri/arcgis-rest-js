const ValueError = require("./errors/ValueError");
const BlorkError = require("./errors/BlorkError");
const debug = require("./helpers/debug");
const findChecker = require("./helpers/findChecker");
const checkers = require("./checkers/checkers");
const modifiers = require("./modifiers/modifiers");

/**
 * Check values against types.
 * Throws an error if a value doesn't match a specified type.
 *
 * @param {mixed} value A single value (or object/array with multiple values) to check against the type(s).
 * @param {string|Function|Array|Object} type A single stringy type reference (e.g. 'str'), functional shorthand type reference (e.g. `String`), or an object/array with list of types (e.g. `{name:'str'}` or `['str', 'num']`).
 * @param {Error} error=void Error type to throw if something goes wrong (defaults to default error).
 * @return {void}
 *
 * @throws An error of `error` type describing what went wrong (usually an error object).
 */
function blork$check(value, type, error) {
	// Check args.
	if (typeof type !== "string") throw new BlorkError("check(): type: Must be string", type);
	if (error && typeof error !== "function") throw new BlorkError("check(): error: Must be function", error);

	// Get checker.
	const checker = findChecker(checkers, modifiers, type);
	if (!checker) throw new BlorkError("check(): type: Checker not found", type);

	// Check the value. If we fail, throw.
	if (!checker(value)) {
		// Which error class to use and prefix to use.
		const thrownError = error || ValueError;
		const prefix = checker.prefix || "Must be";

		// Throw either checker.error or error with standardised message.
		if (thrownError === ValueError || thrownError.prototype instanceof ValueError) {
			throw new thrownError(`${prefix} ${checker.desc}`, value);
		} else {
			throw new thrownError(`${prefix} ${checker.desc} (received ${debug(value)})`);
		}
	}
}

// Exports.
module.exports = blork$check;
