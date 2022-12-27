const unnestedIndexOf = require("./unnestedIndexOf");

/**
 * Split a string by a character, but ignore any that are nested inside brackets `()`, `{}`, `[]` or quotes `"` or `'`
 *
 * @param {string} str The haystack string.
 * @param {string} char The needle character to split the haystack by.
 * @returns {array} An array of strings.
 *
 * @internal
 */
function unnestedSplit(str, char) {
	// Fast escape if char doesn't appear at all.
	if (str.indexOf(char) >= 0) {
		// Find the first one.
		let i = unnestedIndexOf(str, char, 0);
		if (i >= 0) {
			// Vars.
			let j = i;

			// Add the first one to the list.
			const pieces = [str.substring(0, i).trim()];

			// Find any more!
			while (i >= 0) {
				// Keep the last index up to date.
				j = i + 1;
				// Find the next one and add it to the list.
				i = unnestedIndexOf(str, char, j);
				if (i >= 0) pieces.push(str.substring(j, i).trim());
			}

			// Add the last one to the list.
			pieces.push(str.substring(j).trim());

			// Return the pieces.
			return pieces;
		}
	}

	// Nope.
	return false;
}

// Exports.
module.exports = unnestedSplit;
