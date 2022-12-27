const detectNewline = require("detect-newline");
const detectIndent = require("detect-indent");

/**
 * Information about the format of a file.
 * @typedef FileFormat
 * @property {string|number} indent Indentation characters
 * @property {string} trailingWhitespace Trailing whitespace at the end of the file
 */

/**
 * Detects the indentation and trailing whitespace of a file.
 *
 * @param {string} contents contents of the file
 * @returns {FileFormat} Formatting of the file
 */
function recognizeFormat(contents) {
	return {
		indent: detectIndent(contents).indent,
		trailingWhitespace: detectNewline(contents) || "",
	};
}

// Exports.
module.exports = recognizeFormat;
