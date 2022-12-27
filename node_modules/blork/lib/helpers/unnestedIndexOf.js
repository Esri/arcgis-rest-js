const BlorkError = require("../errors/BlorkError");

/**
 * Finds the index of a character, but ignoring any that are nested inside brackets `()`, `{}`, `[]` or quotes `"` or `'`
 *
 * @param {string} str The haystack string.
 * @param {string} char The needle character to split the haystack by.
 * @param {number} offset=0 The index to start looking at.
 * @returns {array} An array of strings.
 *
 * @internal
 */
function unnestedIndexOf(str, char, offset = 0) {
	// Vars.
	const stack = [];

	// Get charCode for needle.
	const ccChar = char.charCodeAt(0);

	// Loop through.
	for (let i = offset, l = str.length; i < l; i++) {
		// Get char.
		const cc = str.charCodeAt(i);

		// What is this character?
		if (cc === ccChar && !stack.length)
			// If it matched (and we're not inside brackets or quotes) we've found it!
			return i;
		else if (cc === 34) {
			// `"` double quote: skip forward until we're out of the string.
			i = str.indexOf('"', i + 1);
		} else if (cc === 39) {
			// `'` single quote: skip forward until we're out of the string.
			i = str.indexOf("'", i + 1) + 1;
		} else if (cc === 40)
			// `(` opening round bracket: push to stack.
			stack.push(40);
		else if (cc === 91)
			// `[` opening square bracket: push to stack.
			stack.push(91);
		else if (cc === 123)
			// `{` opening curly bracket: push to stack.
			stack.push(123);
		else if (cc === 41) {
			// `)` closing round bracket: pop from stack (throw error if malnested).
			if (stack.pop() !== 40) throw new BlorkError('Invalid nesting (expected ")")', str);
		} else if (cc === 93) {
			// `]` closing square bracket: pop from stack (throw error if malnested).
			if (stack.pop() !== 91) throw new BlorkError('Invalid nesting (expected "]")', str);
		} else if (cc === 125) {
			// `}` closing curly bracket: pop from stack (throw error if malnested).
			if (stack.pop() !== 123) throw new BlorkError('Invalid nesting (expected "}")', str);
		}
	}

	// Nope.
	return -1;
}

// Exports.
module.exports = unnestedIndexOf;
