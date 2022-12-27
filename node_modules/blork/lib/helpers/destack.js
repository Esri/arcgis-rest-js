// List of function and file names we blank out (for consistency).
const FUNCS = [undefined, "", "<anonymous>", "global code"];
const FILES = [undefined, "", "<anonymous>", "debugger eval code", "[native code]", "eval"];

// List of parsers with each RegExps to match the rows and functions to parse the matches.
const PARSERS = [
	// Chrome, Node, IE, Edge.
	// e.g. `    at MyClass.myfunc (a/b/myFile.js:28:60)`
	{
		match: /^ +at (?:(?:Object\.)?([^(\r\n]+) \(([^:\r\n]+?)(?::([0-9]+))?(?::([0-9]+))?\)|([^:\r\n]+?)(?::([0-9]+))?(?::([0-9]+))?)$/gm,
		each(matches) {
			// Was function named?
			if (matches[1]) {
				// Named function.
				return {
					function: FUNCS.indexOf(matches[1]) >= 0 ? "" : `${matches[1]}()`,
					file: FILES.indexOf(matches[2]) >= 0 ? "" : matches[2],
					line: matches[3] !== undefined ? parseInt(matches[3], 10) : null,
					column: matches[4] !== undefined ? parseInt(matches[4], 10) : null,
					original: matches[0],
				};
			} else {
				// Anonymous function.
				return {
					function: "",
					file: FILES.indexOf(matches[5]) >= 0 ? "" : matches[5],
					line: matches[6] !== undefined ? parseInt(matches[6], 10) : null,
					column: matches[7] !== undefined ? parseInt(matches[7], 10) : null,
					original: matches[0],
				};
			}
		},
	},
	// Firefox, Safari.
	// e.g. `func@a/b/myFile.js:28:60`
	{
		match: /^(?:Object\.)?([^@\r\n]*)(?:@([^\r\n]+?)(?::([0-9]+))?(?::([0-9]+))?)?$/gm,
		each(matches) {
			return {
				function: FUNCS.indexOf(matches[1]) >= 0 ? "" : `${matches[1]}()`,
				file: FILES.indexOf(matches[2]) >= 0 ? "" : matches[2],
				line: typeof matches[3] !== "undefined" ? parseInt(matches[3], 10) : null,
				column: typeof matches[4] !== "undefined" ? parseInt(matches[4], 10) : null,
				original: matches[0],
			};
		},
	},
];

/**
 * Turn an `Error.stack` string into an array of objects representing that stack.
 * Each browser does this differently so we have an array of different parsers for different browsers.
 *
 * Each object has the following are as follows:
 * 1. `.function` (string) — The name of the function the error occured in (e.g. `abc()` or `MyClass.func()`). This will be empty string for anonymous functions.
 * 2. `.file` (string) — The name of the file the error occured in. This will be empty string for anonymous code (e.g. in the console).
 * 3. `.line` (int) — The line in the file the error occured on.
 * 4. `.column` (int) — The column in the line the error occured on.
 *
 * @param {string} stack The input stack string.
 * @returns {array} An array representing the pieces of the stack, e.g. `[["MyFunc.func()", "file.js", 31, 9], ["abc()", ]]`, or undefined if the stack couldn't be parsed.
 */
function destack(stack) {
	// List of rows in the stack.
	const rows = [];

	// Must be string.
	if (typeof stack === "string" && stack.length) {
		// Loop through the parsers.
		for (let i = 0; i < PARSERS.length; i++) {
			// Does it match this parser?
			if (PARSERS[i].match.test(stack)) {
				// Find all matches found in the stack.
				stack.replace(PARSERS[i].match, (...matches) => {
					// Call each() with the matches.
					rows.push(PARSERS[i].each(matches));
				});

				// Return the rows.
				return rows;
			}
		}
	}

	// Return the rows.
	return rows;
}

// Exports.
module.exports = destack;
