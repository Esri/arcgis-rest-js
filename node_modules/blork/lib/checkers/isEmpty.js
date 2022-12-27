/**
 * Figure out whether a value is 'empty' in a sensible manner.
 *
 * @param {mixed} v The value to check.
 * @returns {boolean} Whether the value is empty, or not.
 */
function isEmpty(v) {
	// String and Array use .length
	if (typeof v === "string" || v instanceof Array) return v.length === 0;
	// Map and set use .size
	if (v instanceof Map || v instanceof Set) return v.size === 0;
	// Objects use the number of keys.
	if (typeof v === "object" && v !== null) return Object.keys(v).length === 0;
	// Everything else (numbers, booleans, null, undefined) is empty if it's falsy.
	return !v;
}

// Description.
isEmpty.desc = "empty";

// Exports.
module.exports = isEmpty;
