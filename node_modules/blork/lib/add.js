const BlorkError = require("./errors/BlorkError");
const findChecker = require("./helpers/findChecker");
const checkers = require("./checkers/checkers");
const modifiers = require("./modifiers/modifiers");

/**
 * Add a new custom checker.
 *
 * Checker function should take in a value, check it and return `true` (success) or `false` (fail).
 * This format is chosen because it allows buttery constructions like `check.add(const str = v => typeof v === 'string', 'string');
 *
 * @param {string} name The type reference for the checker in kebab-case format.
 * @param {function} checker A checker function: Takes a single argument (value), tests it, and returns either true (success) or an error message string in the 'Must be X' format.
 * @param {string} description A description of the type of value that's valid. Must fit the phrase `Must be ${description}`, e.g. "positive number" or "unique string". Defaults to name.
 * @return {void}
 */
function blork$add(name, checker, description) {
	// Check args.
	if (!checkers.kebab(name)) throw new BlorkError(`add(): name: Must be kebab-case string`, name);
	if (typeof checker !== "string" && typeof checker !== "function")
		throw new BlorkError("add(): checker: Must be string or function", checker);
	if (description && typeof description !== "string")
		throw new BlorkError("add(): description: Must be non-empty string", description);

	// Don't double up.
	if (checkers[name]) throw new BlorkError("add(): name: Blork type already exists", name);

	// Checker must be string or function.
	const found = typeof checker === "string" ? findChecker(checkers, modifiers, checker) : checker;
	if (!found) throw new BlorkError("add(): checker: Checker not found", checker);

	// Save the checker and save desc to it.
	const created = (v) => found(v);
	checkers[name] = created;
	created.desc = description || name;
}

// Exports.
module.exports = blork$add;
