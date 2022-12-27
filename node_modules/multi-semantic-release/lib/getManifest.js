const { existsSync, lstatSync, readFileSync } = require("fs");

/**
 * Read the content of target package.json if exists.
 *
 * @param {string} path file path
 * @returns {string} file content
 *
 * @internal
 */
function readManifest(path) {
	// Check it exists.
	if (!existsSync(path)) throw new ReferenceError(`package.json file not found: "${path}"`);

	// Stat the file.
	let stat;
	try {
		stat = lstatSync(path);
	} catch (_) {
		// istanbul ignore next (hard to test — happens if no read access etc).
		throw new ReferenceError(`package.json cannot be read: "${path}"`);
	}

	// Check it's a file!
	if (!stat.isFile()) throw new ReferenceError(`package.json is not a file: "${path}"`);

	// Read the file.
	try {
		return readFileSync(path, "utf8");
	} catch (_) {
		// istanbul ignore next (hard to test — happens if no read access etc).
		throw new ReferenceError(`package.json cannot be read: "${path}"`);
	}
}

/**
 * Get the parsed contents of a package.json manifest file.
 *
 * @param {string} path The path to the package.json manifest file.
 * @returns {object} The manifest file's contents.
 *
 * @internal
 */
function getManifest(path) {
	// Read the file.
	const contents = readManifest(path);

	// Parse the file.
	let manifest;
	try {
		manifest = JSON.parse(contents);
	} catch (_) {
		throw new SyntaxError(`package.json could not be parsed: "${path}"`);
	}

	// Must be an object.
	if (typeof manifest !== "object") throw new SyntaxError(`package.json was not an object: "${path}"`);

	// Must have a name.
	if (typeof manifest.name !== "string" || !manifest.name.length)
		throw new SyntaxError(`Package name must be non-empty string: "${path}"`);

	// Check dependencies.
	const checkDeps = (scope) => {
		if (manifest.hasOwnProperty(scope) && typeof manifest[scope] !== "object")
			throw new SyntaxError(`Package ${scope} must be object: "${path}"`);
	};

	checkDeps("dependencies");
	checkDeps("devDependencies");
	checkDeps("peerDependencies");
	checkDeps("optionalDependencies");

	// NOTE non-enumerable prop is skipped by JSON.stringify
	Object.defineProperty(manifest, "__contents__", { enumerable: false, value: contents });

	// Return contents.
	return manifest;
}

// Exports.
module.exports = getManifest;
