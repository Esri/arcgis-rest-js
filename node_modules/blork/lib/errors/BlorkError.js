const ValueError = require("./ValueError");

/**
 * BlorkError
 *
 * Blork normally throws ValueError when the value you're checking is invalid.
 * But! A BlorkError is thrown when you're using Blork wrong.
 * - The type you're checking against (not the value you're checking) is invalid or doesn't exist.
 */
class BlorkError extends ValueError {}

// Exports.
module.exports = BlorkError;
