/**
 * Detect JSON-friendly values (deeply).
 * JSON can contain null, true, false, strings, finite numbers, plain arrays, plain objects.
 *
 * @param {mixed} v Value that possibly is JSON-friendly.
 * @return {boolean} True if the value is JSON friendly, false otherwise.
 */
function isJSONable(v) {
	// Recurse into the value and give it an empty stack to work with.
	return isJSONableRecurse(v, []);
}

// Recursor function.
function isJSONableRecurse(value, stack) {
	if (value === undefined) {
		// Undefined not allowed in JSON.
		return false;
	} else if (value === null || typeof value === "boolean" || typeof value === "string") {
		// null, true, false, strings are allowed.
		return true;
	} else if (typeof value === "number") {
		// Finite numbers only.
		return Number.isFinite(value);
	} else if (value instanceof Array) {
		// Stop if not plain Array.
		if (Object.getPrototypeOf(value).constructor !== Array) return false;

		// Stop if circular reference.
		if (stack.indexOf(value) !== -1) return false;

		// Keep track of circular references.
		stack.push(value);

		// Check each item individually.
		for (let i = 0; i < value.length; i++) if (!isJSONableRecurse(value[i], stack)) return false;

		// Keep track of circular references.
		stack.pop();

		// Everything was fine.
		return true;
	} else if (value instanceof Object) {
		// Only plain Objects.
		if (Object.getPrototypeOf(value).constructor !== Object) return false;

		// Stop if circular reference.
		if (stack.indexOf(value) !== -1) return false;

		// Keep track of circular references.
		stack.push(value);

		// Check each property individually.
		for (const i in value) if (!isJSONableRecurse(value[i], stack)) return false;

		// Keep track of circular references.
		stack.pop();

		// Everything was fine.
		return true;
	} else {
		// Any other types.
		return false;
	}
}

// Description.
isJSONable.desc = "JSON friendly";

// Exports.
module.exports = isJSONable;
