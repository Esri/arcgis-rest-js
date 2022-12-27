'use strict';

// Matcher - toBe
//
// 1. If values have different types - completely highlight them both
// 2. If values have complex types - matcher "toBe" behaves like "===",
//    which means that complex types are compared by reference.
//    It's impossible to check the reference from here, so just hightlight
//    these objects with warning color.
// 3. If values have the same type and this type is primitive - apply string
//    diff to their string representations
module.exports = function formatToBe(
  diff, expectedValue, actualValue, highlighter, options
) {
  // Different types
  if (expectedValue.type !== actualValue.type) {
    return diff.full(expectedValue, actualValue, highlighter, options);
  }

  // No point to pretty the objects if they are compared by reference.
  if (expectedValue.isComplex()) {
    return diff.warning(expectedValue, actualValue, highlighter, options);
  }

  return diff.primitive(expectedValue, actualValue, highlighter, options);
};
