'use strict';

// Matcher - toEqual
//
// 1. If values have different types - completely highlight them both
// 2. If values have the same type and this type is primitive - apply string
//    diff to their string representations
// 3. If values have complex types, which can not nest - highlight them
//    with reference warning.
// 4. If values have complex types, which can nest - provide deep comparison
//    of all their nested values by applying the same steps.
module.exports = function formatToEqual(
  diff, expectedValue, actualValue, highlighter, options
) {
  // Different types
  if (expectedValue.type !== actualValue.type) {
    return diff.full(expectedValue, actualValue, highlighter, options);
  }

  // Primitives
  if (!expectedValue.isComplex()) {
    return diff.primitive(expectedValue, actualValue, highlighter, options);
  }

  if (expectedValue.canNest()) {
    return diff.complex(expectedValue, actualValue, highlighter, options);
  }

  // Complex, can not nest
  return diff.warning(expectedValue, actualValue, highlighter, options);
};
