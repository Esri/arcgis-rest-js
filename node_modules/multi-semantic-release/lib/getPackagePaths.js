const path = require("path");
const unixify = require("unixify");
const { getPackagesSync } = require("@manypkg/get-packages");
const getManifest = require("./getManifest");
const glob = require("./glob");

/**
 * Return array of package.json for workspace packages.
 *
 * @param {string} cwd The current working directory where a package.json file can be found.
 * @param {string[]|null} ignorePackages (Optional) Packages to be ignored passed via cli.
 * @returns {string[]} An array of package.json files corresponding to the workspaces setting in package.json
 */
function getPackagePaths(cwd, ignorePackages = null) {
	let workspace;
	// Ignore exceptions as we will rely on `getManifest` validation
	try {
		workspace = getPackagesSync(cwd);
	} catch (e) {
		/**/
	}
	workspace = workspace || {
		tool: "root",
		root: { dir: cwd },
	};
	workspace.root.packageJson = getManifest(path.join(workspace.root.dir, "package.json"));

	if (workspace.tool === "root") {
		workspace.packages = [];
	}

	// remove cwd from results
	const packages = workspace.packages.map((p) => path.relative(cwd, p.dir));

	// If packages to be ignored come from CLI, we need to combine them with the ones from manifest workspaces
	if (Array.isArray(ignorePackages)) packages.push(...ignorePackages.map((p) => `!${p}`));

	// Turn workspaces into list of package.json files.
	const workspacePackages = glob(packages.map(unixify), {
		cwd: cwd,
		onlyFiles: true,
		absolute: true,
		gitignore: true,
		deep: 1,
	}).filter((f) => /package.json$/.test(f));

	// Must have at least one workspace-package.
	if (!workspacePackages.length)
		throw new TypeError("package.json: Project must contain one or more workspace-packages");

	// Return.
	return workspacePackages;
}

// Exports.
module.exports = getPackagePaths;
