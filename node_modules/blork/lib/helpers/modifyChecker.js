const unnestedSplit = require("./unnestedSplit");

/**
 * Find a string checker, but create (on the fly) any smart checkers that need to exist.
 *
 * We do this lazily on first run, so the first time you check "str|num" the combined checker will be created and added to checkers.
 * The second time you use this checker, it will be simply reused.
 *
 * 1. OR checkers
 *    - Two or more checker names joined with " | "
 *    - Used if you need a value that can be multiple possible things at the same time.
 *    - Spaces around the pipe are optional (but recommended to enhance readability).
 *    e.g. "num | str" or "date|null" or "lower | upper | null | undefined"
 *
 * 2. AND checkers
 *    - Two or more checker names joined with " & "
 *    - Usually used if you want to combine a built-in checker with a custom checker.
 *    - Note that internal checkers already check type etc, i.e. no need to use "str&lower" as "lower" already checks stringiness.
 *    - Spaces around the pipe are optional (but recommended to enhance readability).
 *    e.g. "lower+ & unique-username" makes sure you have a lowercase non-empty string AND that it's a unique username.
 *
 * 2. Optional checkers
 *    - A checker name that ends in "?"
 *    - Allows the value to be the specified type OR undefined.
 *    e.g. "num?" allows numbers and undefined.
 *
 * @param {array} modifiers An array containing modifiers.
 * @param {string} type A single stringy type reference (e.g. 'str'), functional shorthand type reference (e.g. `String`), or an object/array with list of types (e.g. `{name:'str'}` or `['str', 'num']`).
 * @param {function} checker The find() function for a Blorker instance.
 * @returns {function|undefined} The checker that was lazily created, or undefined if a checker could not be created.
 */
function modifyChecker(modifiers, type, checker) {
	// Loop through modifiers.
	const l = modifiers.length;
	for (let i = 0; i < l; i++) {
		// Vars.
		const m = modifiers[i];
		// What type of modifier is this?
		// Can be string starts with, string ends with, string split, or RegExp match.
		if (m.start && m.end) {
			// String starts and ends with, e.g. "[str, bool]"
			const j = type.indexOf(m.start);
			if (j === 0 && type.lastIndexOf(m.end) === type.length - m.end.length)
				return m.callback(type.substring(m.start.length, type.length - m.end.length).trim(), checker);
		} else if (m.start) {
			// String starts with, e.g. "!bool"
			if (type.indexOf(m.start) === 0) return m.callback(type.substring(m.start.length).trim(), checker);
		} else if (m.end) {
			// String ends with, e.g. "int+"
			if (type.lastIndexOf(m.end) === type.length - m.end.length)
				return m.callback(type.substring(0, type.length - m.end.length).trim(), checker);
		} else if (m.split) {
			// String split, e.g. "|" or "&"
			// This ignores any instances of the splitter that are nested inside brackets or quotes.
			const types = unnestedSplit(type, m.split);
			if (types) return m.callback(types, checker);
		} else if (m.match) {
			// RegExp match, e.g. "str{3,2}"
			// We try to avoid this because it's slower but we use it if we have to.
			const matches = type.match(m.match);
			if (matches) return m.callback(matches, checker);
		}
	}
}

// Exports.
module.exports = modifyChecker;
