/* eslint-disable prettier/prettier */
const isEmpty = require("./isEmpty");
const isCircular = require("./isCircular");
const isJSONable = require("./isJSONable");

// Regexes.
const R_ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
const R_ALPHABETIC = /^[a-zA-Z]+$/;
const R_NUMERIC = /^[0-9]+$/;
const R_UPPER = /^[A-Z]+$/;
const R_LOWER = /^[a-z]+$/;
const R_CAMEL = /^[a-z][a-zA-Z0-9]*$/; // e.g. myVarName
const R_PASCAL = /^[A-Z][a-zA-Z0-9]*$/; // e.g. MyVarName
const R_SNAKE = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/; // e.g. my_var_name
const R_SCREAMING = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/; // e.g. MY_VAR_NAME
const R_KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/; // e.g. my-var-name
const R_TRAIN = /^[A-Z][a-zA-Z0-9]*(-[A-Z0-9][a-zA-Z0-9]+)*$/; // e.g. My-Var-Name
const R_IDENTIFIER = /^[$a-zA-Z_][a-zA-Z0-9_$]*$/;
const R_ABSOLUTE = /^(?:\/|[a-zA-Z]:\\|[/\\]{2}[^/\\]+[/\\/]+[^/\\]+)()/; // e.g. "/" (Unix) "C:\" (Windows) or "//server/file" or "\\server\file" (UNC)

// Checkers.
function isNull(v) { return v === null; }
function isUndefined(v) { return v === undefined; }
function isDefined(v) { return v !== undefined; }
function isBoolean(v) { return v === true || v === false; }
function isTrue(v) { return v === true; }
function isFalse(v) { return v === false; }
function isTruthy(v) { return !!v; }
function isFalsy(v) { return !v; }
function isZero(v) { return v === 0; }
function isOne(v) { return v === 1; }
function isNaN(v) { return Number.isNaN(v); }
function isFiniteNumber(v) { return Number.isFinite(v); }
function isPositiveNumber(v) { return Number.isFinite(v) && v >= 0; }
function isNegativeNumber(v) { return Number.isFinite(v) && v <= 0; }
function isInteger(v) { return Number.isInteger(v) && v >= Number.MIN_SAFE_INTEGER && v <= Number.MAX_SAFE_INTEGER; }
function isPositiveInteger(v) { return Number.isInteger(v) && v >= 0 && v <= Number.MAX_SAFE_INTEGER; }
function isNegativeInteger(v) { return Number.isInteger(v) && v >= Number.MIN_SAFE_INTEGER && v <= 0; }
function isInt8(v) { return Number.isInteger(v) && v >= -128 && v <= 127; } // The byte type is a signed integer type that has values in the range [−128, 127].
function isUInt8(v) { return Number.isInteger(v) && v >= 0 && v <= 255; } // The octet type is an unsigned integer type that has values in the range [0, 255].
function isInt16(v) { return Number.isInteger(v) && v >= -32768 && v <= 32767; } // The short type is a signed integer type that has values in the range [−32768, 32767].
function isUInt16(v) { return Number.isInteger(v) && v >= 0 && v <= 65535; } // The unsigned short type is an unsigned integer type that has values in the range [0, 65535].
function isInt32(v) { return Number.isInteger(v) && v >= -2147483648 && v <= 2147483647; } // The long type is a signed integer type that has values in the range [−2147483648, 2147483647].
function isUInt32(v) { return Number.isInteger(v) && v >= 0 && v <= 4294967295; } // The unsigned long type is an unsigned integer type that has values in the range [0, 4294967295].
function isString(v) { return typeof v === "string"; }
function isAlphanumeric(v) { return typeof v === "string" && R_ALPHANUMERIC.test(v); }
function isAlphabetic(v) { return typeof v === "string" && R_ALPHABETIC.test(v); }
function isNumeric(v) { return typeof v === "string" && R_NUMERIC.test(v); }
function isLower(v) { return typeof v === "string" && R_LOWER.test(v); }
function isUpper(v) { return typeof v === "string" && R_UPPER.test(v); }
function isCamel(v) { return typeof v === "string" && R_CAMEL.test(v); }
function isPascal(v) { return typeof v === "string" && R_PASCAL.test(v); }
function isSnake(v) { return typeof v === "string" && R_SNAKE.test(v); }
function isScreaming(v) { return typeof v === "string" && R_SCREAMING.test(v); }
function isKebab(v) { return typeof v === "string" && R_KEBAB.test(v); }
function isTrain(v) { return typeof v === "string" && R_TRAIN.test(v); }
function isIdentifier(v) { return typeof v === "string" && R_IDENTIFIER.test(v); }
function isPath(v) { return typeof v === "string" && v.length > 0 && v.length <= 260 && v.indexOf(String.fromCharCode(0)) === -1; } // Total length is no more than 260 (Windows), doesn't contain NUL (Windows and Unix).
function isAbsolute(v) { return isPath(v) && R_ABSOLUTE.test(v); }
function isRelative(v) { return isPath(v) && !R_ABSOLUTE.test(v); }
function isPrimitive(v) { return v === undefined || v === null || typeof v === "boolean" || typeof v === "string" || Number.isFinite(v); }
function isFunction(v) { return typeof v === "function"; }
function isObject(v) { return typeof v === "object" && v !== null; }
function isPlainObject(v) { return typeof v === "object" && v !== null && Object.getPrototypeOf(v).constructor === Object; }
function isIterable(v) { return typeof v === "object" && v !== null && typeof v[Symbol.iterator] === "function"; }
function isPlainArray(v) { return v instanceof Array && Object.getPrototypeOf(v).constructor === Array; }
function isArraylike(v) { return typeof v === "object" && v !== null && v.hasOwnProperty("length") && typeof v.length === "number" && Number.isInteger(v.length) && v.length >= 0 && v.length <= Number.MAX_SAFE_INTEGER; }
function isDate(v) { return v instanceof Date; }
function isFutureDate(v) { return v instanceof Date && v.getTime() > Date.now(); }
function isPastDate(v) { return v instanceof Date && v.getTime() < Date.now(); }
function isMap(v) { return v instanceof Map; }
function isWeakMap(v) { return v instanceof WeakMap; }
function isSet(v) { return v instanceof Set; }
function isWeakSet(v) { return v instanceof WeakSet; }
function isPromise(v) { return v instanceof Promise; }
function isRegExp(v) { return v instanceof RegExp; }
function isError(v) { return v instanceof Error; }
function isEvalError(v) { return v instanceof EvalError; }
function isRangeError(v) { return v instanceof RangeError; }
function isReferenceError(v) { return v instanceof ReferenceError; }
function isSyntaxError(v) { return v instanceof SyntaxError; }
function isTypeError(v) { return v instanceof TypeError; }
function isURIError(v) { return v instanceof URIError; }
function isSymbol(v) { return typeof v === "symbol"; }
function isAny() { return true; }

// Descriptions.
isNull.desc = "null";
isUndefined.desc = "undefined";
isDefined.desc = "defined";
isBoolean.desc = "boolean";
isTrue.desc = "true";
isFalse.desc = "false";
isTruthy.desc = "truthy";
isFalsy.desc = "falsy";
isZero.desc = "zero";
isOne.desc = "one";
isNaN.desc = "NaN";
isFiniteNumber.desc = "finite number";
isPositiveNumber.desc = "positive finite number";
isNegativeNumber.desc = "negative finite number";
isInteger.desc = "integer";
isPositiveInteger.desc = "positive integer";
isNegativeInteger.desc = "negative integer";
isInt8.desc = "signed 8-bit integer (-128 to 127)";
isUInt8.desc = "unsigned 8-bit integer (0 to 255)";
isInt16.desc = "signed 16-bit integer (-32768 to 32767)";
isUInt16.desc = "unsigned 16-bit integer (65535)";
isInt32.desc = "signed 32-bit integer (-2147483648 to 2147483647)";
isUInt32.desc = "unsigned 32-bit integer (0 to 4294967295)";
isString.desc = "string";
isAlphanumeric.desc = "alphanumeric string";
isAlphabetic.desc = "alphabetic string";
isNumeric.desc = "numeric string";
isLower.desc = "lowercase string";
isUpper.desc = "UPPERCASE string";
isCamel.desc = "camelCase string";
isPascal.desc = "PascalCase string";
isSnake.desc = "snake_case string";
isScreaming.desc = "SCREAMING_SNAKE_CASE string";
isKebab.desc = "kebab-case string";
isTrain.desc = "Camel-Kebab-Case string";
isIdentifier.desc = "valid JavaScript identifier";
isPath.desc = "valid path";
isAbsolute.desc = "absolute path";
isRelative.desc = "relative path";
isFunction.desc = "function";
isObject.desc = "object";
isPlainObject.desc = "plain object";
isIterable.desc = "iterable object";
isPlainArray.desc = "plain array";
isArraylike.desc = "arraylike object with a numeric length property";
isDate.desc = "date";
isFutureDate.desc = "date in the future";
isPastDate.desc = "date in the past";
isMap.desc = "map";
isWeakMap.desc = "weak map";
isSet.desc = "set";
isWeakSet.desc = "weak set";
isPromise.desc = "promise";
isRegExp.desc = "regular expression";
isError.desc = "Error";
isEvalError.desc = "EvalError";
isRangeError.desc = "RangeError";
isReferenceError.desc = "ReferenceError";
isSyntaxError.desc = "SyntaxError";
isTypeError.desc = "TypeError";
isURIError.desc = "URIError";
isSymbol.desc = "symbol";
isAny.desc = "any";

// Exports.
const checkers = {
	// Primitives.
	"primitive": isPrimitive,
	"null": isNull,
	"undefined": isUndefined,
	"void": isUndefined,
	"undef": isUndefined,
	"defined": isDefined,
	"def": isDefined,

	// Booleans.
	"boolean": isBoolean,
	"bool": isBoolean,
	"true": isTrue,
	"false": isFalse,
	"truthy": isTruthy,
	"falsy": isFalsy,

	// Numbers.
	"zero": isZero,
	"one": isOne,
	"nan": isNaN,
	"number": isFiniteNumber,
	"num": isFiniteNumber,
	"+number": isPositiveNumber,
	"+num": isPositiveNumber,
	"-number": isNegativeNumber,
	"-num": isNegativeNumber,
	"integer": isInteger,
	"int": isInteger,
	"+integer": isPositiveInteger,
	"+int": isPositiveInteger,
	"-integer": isNegativeInteger,
	"-int": isNegativeInteger,
	"int8": isInt8,
	"uint8": isUInt8,
	"int16": isInt16,
	"uint16": isUInt16,
	"int32": isInt32,
	"uint32": isUInt32,
	"byte": isInt8,
	"octet": isUInt8,
	"short": isInt16,
	"ushort": isUInt16,
	"long": isInt32,
	"ulong": isUInt32,

	// Strings.
	"string": isString,
	"str": isString,
	"alphanumeric": isAlphanumeric,
	"alphabetic": isAlphabetic,
	"numeric": isNumeric,
	"lower": isLower,
	"upper": isUpper,
	"camel": isCamel,
	"pascal": isPascal,
	"snake": isSnake,
	"screaming": isScreaming,
	"kebab": isKebab,
	"slug": isKebab,
	"train": isTrain,
	"identifier": isIdentifier,
	"path": isPath,
	"abs": isAbsolute,
	"absolute": isAbsolute,
	"rel": isRelative,
	"relative": isRelative,

	// Objects.
	"function": isFunction,
	"func": isFunction,
	"objectlike": isObject,
	"object": isPlainObject,
	"obj": isPlainObject,
	"iterable": isIterable,
	"circular": isCircular,
	"array": isPlainArray,
	"arr": isPlainArray,
	"arraylike": isArraylike,
	"arguments": isArraylike,
	"args": isArraylike,
	"date": isDate,
	"future": isFutureDate,
	"past": isPastDate,
	"map": isMap,
	"weakmap": isWeakMap,
	"set": isSet,
	"weakset": isWeakSet,
	"promise": isPromise,
	"regex": isRegExp,
	"regexp": isRegExp,
	"err": isError,
	"error": isError,
	"evalerror": isEvalError,
	"rangeerror": isRangeError,
	"referenceerror": isReferenceError,
	"syntaxerror": isSyntaxError,
	"typeerror": isTypeError,
	"urierror": isURIError,
	"symbol": isSymbol,

	// Other.
	"empty": isEmpty,
	"any": isAny,
	"mixed": isAny,
	"json": isJSONable,
	"jsonable": isJSONable,
};

// Exports.
module.exports = checkers;