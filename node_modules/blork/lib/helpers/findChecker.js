const modifyChecker = require("./modifyChecker");

/**
 * Internal find a checker.
 *
 * @param {object} checkers An object containing named checkers.
 * @param {array} modifiers An array containing modifiers.
 * @param {string} type A single stringy type reference (e.g. 'str').
 * @return {function} The found checker function.
 *
 * @internal
 */
function findChecker(checkers, modifiers, type) {
	// Return the checker.
	if (checkers.hasOwnProperty(type)) return checkers[type];

	// Try to create the checker.
	const checker = modifyChecker(modifiers, type, (t) => findChecker(checkers, modifiers, t));
	if (checker) {
		checkers[type] = checker;
		return checker;
	}
}

// Exports.
module.exports = findChecker;
