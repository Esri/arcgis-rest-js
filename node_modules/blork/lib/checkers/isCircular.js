/**
 * Figure out whether a value contains circular references.
 *
 * @param {mixed} v The value to check.
 * @returns {boolean} Whether the value had a circular reference, or not.
 */
function isCircular(v) {
	// Non-objects can't contain circular references anyway.
	// Recurse into the value and give it an empty stack to work with.
	if (v instanceof Object) return isCircularRecurse(v, []);
	else return false;
}

// Recursor function.
function isCircularRecurse(obj, stack) {
	// Loop through the object.
	for (const key in obj) {
		// Only own keys (ignore non-own keys).
		if (obj.hasOwnProperty(key)) {
			// Get the property.
			const prop = obj[key];

			// Check for object properties.
			if (prop instanceof Object) {
				// If prop already exists in stack, this is circular.
				if (~stack.indexOf(prop)) return true;

				// Push to stack, recurse into object, pop from stack.
				stack.push(prop);
				if (isCircularRecurse(prop, stack)) return true; // Return early if we found one early.
				stack.pop(prop);
			}
		}
	}

	// No circular references found.
	return false;
}

// Description.
isCircular.desc = "containing circular references";

// Exports.
module.exports = isCircular;
