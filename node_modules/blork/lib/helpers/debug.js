// Constants.
const DEPTH = 3; // Maximum recursion length.
const MAX_ITEMS = 40; // Maximum length of objects.
const MAX_PROPS = 40; // Maximum length of arrays.
const MAX_CHARS = 50; // Maximum length of strings.
const MULTILINE_CHARS = 72; // Maximum length in chars before arrays and objects are multiline.

/**
 * Neatly convert any value into a string for debugging.
 *
 * @param {mixed} value The value to debug.
 * @return {string} String representing the debugged value.
 */
function debug(value) {
	// Defer to actual debugger, with empty tabs and stack.
	return debugInternal(value, "", []);
}

/**
 * Actual debugger.
 *
 * @param {mixed} value The value to debug.
 * @param {string} tabs A prefix to prepend to the output if it goes onto a new line.
 * @param {Array} stack A prefix
 * @return {string} String representing the debugged value.
 *
 * @internal
 */
function debugInternal(value, tabs, stack) {
	/* istanbul ignore else */ // 100% coverage (the else branch is something that should theoretically never happen but we can't find a way to test).
	if (value === null) return "null";
	else if (value === undefined) return "undefined";
	else if (value === true) return "true";
	else if (value === false) return "false";
	else if (typeof value === "number") return value.toString();
	else if (typeof value === "symbol") return value.toString();
	else if (typeof value === "string") return debugString(value);
	else if (typeof value === "function") return debugFunction(value);
	else if (typeof value === "object") {
		if (value instanceof Error) {
			// Error, e.g. TypeError "What went wrong"
			return debugError(value);
		} else if (value.constructor === Date) {
			// Date, e.g. 2011-10-05T14:48:00.000Z
			return value.toISOString();
		} else if (value.constructor === RegExp) {
			// Regular expression, e.g. /abc/
			return value.toString();
		} else if (value.constructor === Array) {
			// Empty array, e.g. []
			if (!value.length) return "[]";

			// Circular reference (don't infinite loop)
			if (stack.indexOf(value) !== -1) return "[↻]";

			// Stack too deep.
			if (stack.length >= DEPTH) return "[…]";

			// Stop infinite loops.
			stack.push(value);

			// Build array rows.
			const rows = [];
			for (let i = 0; i < value.length && i < MAX_ITEMS; i++) {
				// Append each new line to the string.
				rows.push(debugInternal(value[i], `${tabs}\t`, stack));
			}

			// Stop infinite loops.
			stack.pop();

			// Array, e.g. [1, 3, 4]
			// If row length > 72 chars, make multiline.
			return rows.reduce((t, v) => t + v.length, 0) > MULTILINE_CHARS
				? `[\n\t${tabs}${rows.join(`,\n\t${tabs}`)}\n${tabs}]` // Multiline.
				: `[${rows.join(", ")}]`; // Single line.
		} else {
			// Get keys.
			const keys = Object.keys(value);

			// Get named part at start.
			const name =
				value.constructor === Object
					? ""
					: value.constructor instanceof Function && value.constructor.name.length
					? `${value.constructor.name} `
					: "anonymous object ";

			// Empty object, e.g. {}
			if (!keys.length) return `${name}{}`;

			// Circular reference (don't infinite loop)
			if (stack.indexOf(value) !== -1) return `${name}{↻}`;

			// Stack too deep.
			if (stack.length >= DEPTH) return `${name}{…}`;

			// Stop infinite loops.
			stack.push(value);

			// Build object rows.
			const rows = [];
			for (let i = 0; i < keys.length && i < MAX_PROPS; i++) {
				// Object line, e.g. "dog":
				const key = keys[i];
				rows.push(`${debugString(key)}: ${debugInternal(value[key], `${tabs}\t`, stack)}`);
			}

			// Stop infinite loops.
			stack.pop();

			// Object, e.g. Object: { "a": 123 }
			// If row length > 72 chars, make multiline.
			return rows.reduce((t, v) => t + v.length, 0) > MULTILINE_CHARS
				? `${name}{\n\t${tabs}${rows.join(`,\n\t${tabs}`)}\n${tabs}}` // Multiline.
				: `${name}{ ${rows.join(", ")} }`; // Single line.
		}
	} else {
		// Any other type.
		return typeof value;
	}
}

// Debug a string.
// e.g. "abc" or "This is a \"good\" dog"
function debugString(value) {
	// Reduce to under 200 chars.
	if (value.length > MAX_CHARS) value = `${value.substr(0, MAX_CHARS)}…`;
	// Escape double quotes.
	value = value.replace(/"/g, '\\"');
	// Wrapped in quotes.
	return `"${value}"`;
}

// Debug a function.
// e.g. myFunc()
function debugFunction(value) {
	if (typeof value.name === "string" && value.name.length > 0) {
		// Named function, e.g. "myFunc()"
		return `${value.name}()`;
	} else {
		// Unnamed function, e.g. "function ()"
		return "function ()";
	}
}

// Debug an error.
function debugError(value) {
	// Error, e.g. TypeError "Must be a string"
	const name = value.name || value.constructor.name;
	const { message } = value;
	if (message) return `${name} ${debugString(value.message)}`;
	else return name;
}

// Exports.
module.exports = debug;
