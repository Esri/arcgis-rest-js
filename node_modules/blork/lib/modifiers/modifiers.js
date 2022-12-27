const debug = require("../helpers/debug");
const unnestedSplit = require("../helpers/unnestedSplit");

// Functions.
// Wrap any checkers (that need to be wrapped) in () parens.
function wrapModified(checker) {
	return checker.modified ? `(${checker.desc})` : checker.desc;
}
function wrapCombined(checker) {
	return checker.combined ? `(${checker.desc})` : checker.desc;
}

// List of available modifiers.
// In priority order (which basically works the same as operator precidence in programming languages).
module.exports = [
	// Prefix type.
	// Prefixed onto the error message that gets thrown if the value doesn't match.
	// Usually used to name the variable we're currently checking.
	{
		// One or more non-space characters then ': ' colon-space.
		match: /^([^ ]+): (.+)/,
		callback: function prefixModifier(matches, find) {
			// Get normal checker.
			const valueChecker = find(matches[2]);

			// Checkers must exist.
			if (!valueChecker) return;

			// Create a checker.
			const checker = (v) => valueChecker(v);

			// Checker settings.
			checker.desc = valueChecker.desc;
			checker.prefix = `${matches[1]}: ${valueChecker.prefix || "Must be"}`;

			// Return it.
			return checker;
		},
	},

	// Return type.
	// Changes error message from e.g. "Must be string" to "Must return string"
	{
		start: "return ",
		callback: function returnModifier(type, find) {
			// Get normal checker.
			const valueChecker = find(type);

			// Checkers must exist.
			if (!valueChecker) return;

			// Create a checker.
			const checker = (v) => valueChecker(v);

			// Checker settings.
			checker.desc = valueChecker.desc;
			checker.prefix = "Must return";

			// Return it.
			return checker;
		},
	},

	// AND combined type, e.g. `upper & str`
	{
		// `&` ampersand anywhere in the string.
		split: "&",
		callback: function andModifier(types, find) {
			// Convert matches to types.
			const { length } = types;
			const checkers = types.map(find);

			// Checkers must exist.
			if (checkers.indexOf(undefined) >= 0) return;

			// Check each checker.
			const checker = (v) => {
				// Loop through and call each checker.
				for (let i = 0; i < length; i++) if (!checkers[i](v)) return false; // Fail.
				return true; // Otherwise pass.
			};

			// Checker settings.
			checker.desc = checkers
				// Get checker descriptions and wrap any that have been modified.
				.map((c) => wrapModified(c))
				// Join them with " and "
				.join(" and ");
			checker.modified = true;
			checker.combined = true;

			// Return it.
			return checker;
		},
	},

	// OR combined type, e.g. `str | num`
	{
		// `|` pipe anywhere in the string.
		split: "|",
		callback: function orModifier(types, find) {
			// Convert matches to types.
			const { length } = types;
			const checkers = types.map(find);

			// Checkers must exist.
			if (checkers.indexOf(undefined) >= 0) return;

			// Check each checker.
			const checker = (v) => {
				// Loop through and call each checker.
				for (let i = 0; i < length; i++) if (checkers[i](v)) return true; // Pass.
				return false; // Otherwise fail.
			};

			// Checker settings.
			checker.desc = checkers
				// Get checker descriptions and wrap any that have been modified.
				.map((c) => wrapModified(c))
				// Join them with " and "
				.join(" or ");
			checker.modified = true;
			checker.combined = true;

			// Return it.
			return checker;
		},
	},

	// Double quote string literal, e.g. `'1937'`
	{
		// `"` double quote at start and end of the string.
		start: '"',
		end: '"',
		callback: function stringDoubleModifier(type) {
			// Create a checker.
			const checker = (v) => typeof v === "string" && v === type;

			// Checker settings.
			checker.desc = debug(type);
			checker.string = type;

			// Return it.
			return checker;
		},
	},

	// `'` single quote string literal, e.g. `'1937'`
	{
		// `'` single quote at start and end of the string.
		start: "'",
		end: "'",
		callback: function stringSingleModifier(type) {
			// Create a checker.
			const checker = (v) => typeof v === "string" && v === type;

			// Checker settings.
			checker.desc = debug(type);
			checker.string = type;

			// Return it.
			return checker;
		},
	},

	// Grouped type, e.g. `(num | str)`
	{
		// `(` and `)` parenthesis at start and end of the string.
		start: "(",
		end: ")",
		callback: function groupedModifier(type, find) {
			// Find the real checker.
			const valueChecker = find(type);

			// Checkers must exist.
			if (!valueChecker) return;

			// Create a checker.
			const checker = (v) => valueChecker(v);

			// Checker settings.
			checker.desc = valueChecker.desc;
			checker.modified = valueChecker.modified;
			checker.combined = valueChecker.combined;

			// Return it.
			return checker;
		},
	},

	// Array type, e.g. `str[]`
	{
		// `[]` square brackets at end of the string.
		end: "[]",
		callback: function arrayModifier(type, find) {
			// Get normal checker.
			const isArray = find("array");
			const valueChecker = find(type);

			// Checkers must exist.
			if (!valueChecker) return;

			// Create array type checker.
			const checker = (v) => {
				// Must be an array.
				if (!isArray(v)) return false;

				// Check every item in the array matches type.
				return v.every((w) => valueChecker(w));
			};

			// Checker settings.
			checker.desc = `plain array containing ${wrapCombined(valueChecker)}`;
			checker.modified = true;

			// Return it.
			return checker;
		},
	},

	// Tuple type, e.g. `[str, num]`
	{
		// `[` and `]` square brackets at start and end of the string.
		start: "[",
		end: "]",
		callback: function tupleModifier(type, find) {
			// Get array checker.
			const isArray = find("array");

			// Split type by commas and get checker for each.
			const types = unnestedSplit(type, ",") || [type];
			const checkers = types.map(find);
			const { length } = checkers;

			// Checkers must exist.
			if (checkers.indexOf(undefined) >= 0) return;

			// Create array type checker.
			const checker = (v) => {
				// Must be an array.
				if (!isArray(v)) return false;

				// Tuple length must be exactly the same.
				if (v.length !== checkers.length) return false;

				// Tuple array
				for (let i = 0; i < length; i++) if (!checkers[i](v[i])) return false; // Fail.
				return true; // Otherwise pass.
			};

			// Map checker descriptions.
			const descs = checkers.map((c) => c.desc);

			// Checker settings.
			checker.desc = `plain array tuple like [${descs.join(", ")}]`;
			checker.modified = true;

			// Return it.
			return checker;
		},
	},

	// Object type, e.g. `{ camel: num }`
	{
		// `{` and `}` at start and end of the string.
		start: "{",
		end: "}",
		callback: function objectModifier(type, find) {
			// Get object checker.
			const objectChecker = find("object");

			// Split type by commas.
			// Each property in the object type is treated like an OR statement.
			const types = unnestedSplit(type, ",") || [type];
			const namedKeys = [];
			const namedCheckers = {};
			const anyCheckers = [];
			let checkersExist = true;

			// Loop through to create list of named and any checkers.
			types.forEach((t) => {
				// Split into key: value.
				const kv = unnestedSplit(t, ":");

				// Find corresponding checker for each.
				if (kv) {
					// Key checker.
					const k = find(kv[0]);
					const v = find(kv[1]);
					if (!k || !v) checkersExist = false;
					else if (k.string) {
						// Named checker.
						namedKeys.push(k.string);
						namedCheckers[k.string] = v;
					} else {
						// Value and key any checker.
						anyCheckers.push([k, v]);
					}
				} else {
					// Value only checker.
					const v = find(t);
					if (!v) checkersExist = false;
					anyCheckers.push([undefined, v]);
				}
			});
			const namedLength = namedKeys.length;
			const anyLength = anyCheckers.length;

			// Checkers must exist.
			if (!checkersExist) return;

			// Create array type checker.
			const checker = (v) => {
				// Must be an array.
				if (!objectChecker(v)) return false;

				// Check named properties.
				for (let i = 0; i < namedLength; i++) {
					// Check value for named checkers.
					if (!namedCheckers[namedKeys[i]](v[namedKeys[i]])) return false; // Fail.
				}

				// Check other properties.
				if (anyLength) {
					// Loop through all object keys.
					const keys = Object.keys(v);
					for (let i = 0, l = keys.length; i < l; i++) {
						// Ignore named checkers.
						if (!namedCheckers[keys[i]]) {
							// Loop through any checkers
							for (let j = 0; j < anyLength; j++) {
								// Check key.
								if (anyCheckers[j][0] && !anyCheckers[j][0](keys[i])) return false; // Fail.
								// Check value.
								if (!anyCheckers[j][1](v[keys[i]])) return false; // Fail.
							}
						}
					}
				}

				// Otherwise pass.
				return true;
			};

			// Descriptions.
			const namedDescs = namedKeys.map((k) => `${debug(k)}: ${wrapCombined(namedCheckers[k])}`);
			const anyDescs = anyCheckers.map((c) => {
				// Key and value check or key only check.
				if (c[0]) return `${wrapCombined(c[0])}: ${wrapCombined(c[1])}`;
				else return `string: ${wrapCombined(c[1])}`;
			});
			const descs = namedDescs.concat(anyDescs);

			// Checker settings.
			checker.desc = `plain object like { ${descs.join(", ")} }`;
			checker.modified = true;

			// Return it.
			return checker;
		},
	},

	// Inverted type, e.g. `!num`
	{
		// `!` exclamation followed by one or characters.
		start: "!",
		callback: function invertedModifier(type, find) {
			// Get normal checker.
			const valueChecker = find(type);

			// Checkers must exist.
			if (!valueChecker) return;

			// Create an optional checker for this inverted type.
			// Returns 0 if undefined, or passes through to the normal checker.
			const checker = (v) => !valueChecker(v);

			// Checker settings.
			checker.modified = true;
			checker.desc = `anything except ${wrapCombined(valueChecker)}`;

			// Return it.
			return checker;
		},
	},

	// Optional type, e.g. `num?`
	{
		// `?` question mark at the end of the string.
		end: "?",
		callback: function optionalModifier(type, find) {
			// Get normal checker.
			const valueChecker = find(type);

			// Checkers must exist.
			if (!valueChecker) return;

			// Create an optional checker for this optional type.
			// Returns 0 if undefined, or passes through to the normal checker.
			const checker = (v) => (v === undefined ? true : valueChecker(v));

			// Checker settings.
			checker.modified = true;
			checker.combined = true;
			checker.desc = `${wrapCombined(valueChecker)} or empty`;

			// Return it.
			return checker;
		},
	},

	// Non-empty type, e.g. `arr+`
	{
		// `+` plus at the end of the string.
		end: "+",
		callback: function nonEmptyModifier(type, find) {
			// Get normal checker.
			const emptyChecker = find("empty");
			const valueChecker = find(type);

			// Checkers must exist.
			if (!valueChecker) return;

			// Create a length checker for this non-empty type.
			// Returns true if checker passes and there's a numeric length or size property with a value of >0.
			const checker = (v) => {
				// Must pass the checker first.
				if (!valueChecker(v)) return false;
				// Then use the (inverse) empty checker.
				return !emptyChecker(v);
			};

			// Checker settings.
			checker.modified = true;
			checker.desc = `non-empty ${wrapCombined(valueChecker)}`;

			// Return it.
			return checker;
		},
	},

	// Number type.
	// e.g. `1234` or `123.456` (as strings).
	{
		match: /^([0-9.]+)$/,
		callback: function numberModifier(matches) {
			// Vars.
			const number = parseFloat(matches[1]);

			// Create a checker.
			const checker = (v) => typeof v === "number" && v === number;

			// Checker settings.
			checker.desc = number.toString();
			checker.string = number.toString();

			// Return the checker.
			return checker;
		},
	},

	// Size type.
	// e.g. `str{12}` (string with exactly 12 chars)
	// e.g. `num{64,128}` (nums between 64 and 128)
	// e.g. `arr{4,}` (arrays with a minimum of 4 itmes)
	{
		// One or more chars followed by {12} or {12,} or {,12} or {6,12}
		match: /^(.+)\{(?:([0-9]+)|([0-9]+),([0-9]*)|,([0-9]+))\}$/,
		callback: function sizeModifier(matches, find) {
			// Get normal checker.
			const valueChecker = find(matches[1]);

			// Checkers must exist.
			if (!valueChecker) return;

			// Vars.
			const min = matches[2] ? parseInt(matches[2], 10) : matches[3] ? parseInt(matches[3], 10) : null;
			const max = matches[2]
				? parseInt(matches[2], 10)
				: matches[4]
				? parseInt(matches[4], 10)
				: matches[5]
				? parseInt(matches[5])
				: null;

			// Create a length checker for this type.
			const checker = (v) => {
				// Must pass the checker first.
				if (!valueChecker(v)) return false;
				// Numbers use exact number
				if (typeof v === "number") return (min === null || v >= min) && (max === null || v <= max);
				// String and Array use .length
				if (typeof v === "string" || v instanceof Array)
					return (min === null || v.length >= min) && (max === null || v.length <= max);
				// Map and set use .size
				if (v instanceof Map || v instanceof Set)
					return (min === null || v.size >= min) && (max === null || v.size <= max);
				// Objects use the number of keys.
				if (typeof v === "object" && v !== null) {
					const l = Object.keys(v).length;
					return (min === null || l >= min) && (max === null || l <= max);
				}
				// Nothing else has length to check.
				return false;
			};

			// Checker settings.
			checker.modified = true;
			checker.desc = wrapCombined(valueChecker);
			if (min === max) checker.desc += ` with size ${min}`;
			else if (typeof min === "number") {
				if (typeof max === "number") checker.desc += ` with size between ${min} and ${max}`;
				else checker.desc += ` with minimum size ${min}`;
			} else checker.desc += ` with maximum size ${max}`;

			// Return it.
			return checker;
		},
	},
];
