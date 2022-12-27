const BlorkError = require("./errors/BlorkError");
const findChecker = require("./helpers/findChecker");
const checkers = require("./checkers/checkers");
const modifiers = require("./modifiers/modifiers");

/**
 * Return a specific checker.
 *
 * @param {string|Function|Array|Object} type A single stringy type reference (e.g. 'str'), functional shorthand type reference (e.g. `String`), or an object/array with list of types (e.g. `{name:'str'}` or `['str', 'num']`).
 * @return {function} The specified checker or undefined if it doesn't exist.
 */
function blork$checker(type) {
	// Check args.
	if (typeof type !== "string") throw new BlorkError("checker(): type: Must be string", type);

	// Get checker.
	const checker = findChecker(checkers, modifiers, type);
	if (!checker) throw new BlorkError("checker(): type: Checker not found", type);

	// Return checker.
	return (v) => checker(v);
}

// Exports.
module.exports = blork$checker;
