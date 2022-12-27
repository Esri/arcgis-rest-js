const { writeFileSync } = require("fs");
const semver = require("semver");
const { isObject, isEqual, transform } = require("lodash");
const recognizeFormat = require("./recognizeFormat");
const getManifest = require("./getManifest");
const { getHighestVersion, getLatestVersion } = require("./utils");
const { getTags } = require("./git");
const debug = require("debug")("msr:updateDeps");

/**
 * Resolve next package version.
 *
 * @param {Package} pkg Package object.
 * @returns {string|undefined} Next pkg version.
 * @internal
 */
const getNextVersion = (pkg) => {
	const lastVersion = pkg._lastRelease && pkg._lastRelease.version;

	return lastVersion && typeof pkg._nextType === "string"
		? semver.inc(lastVersion, pkg._nextType)
		: lastVersion || "1.0.0";
};

/**
 * Resolve the package version from a tag
 *
 * @param {Package} pkg Package object.
 * @param {string} tag The tag containing the version to resolve
 * @returns {string} The version of the package
 * @returns {string|null} The version of the package or null if no tag was passed
 * @internal
 */
const getVersionFromTag = (pkg, tag) => {
	if (!pkg.name) return tag || null;
	if (!tag) return null;

	const strMatch = tag.match(/[0-9].[0-9].[0-9].*/);
	return strMatch && strMatch[0] && semver.valid(strMatch[0]) ? strMatch[0] : null;
};

/**
 * Resolve next package version on prereleases.
 *
 * @param {Package} pkg Package object.
 * @param {Array<string>} tags Override list of tags from specific pkg and branch.
 * @returns {string|undefined} Next pkg version.
 * @internal
 */
const getNextPreVersion = (pkg, tags) => {
	const tagFilters = [pkg._preRelease];
	const lastVersion = pkg._lastRelease && pkg._lastRelease.version;
	// Extract tags:
	// 1. Set filter to extract only package tags
	// 2. Get tags from a branch considering the filters established
	// 3. Resolve the versions from the tags
	// TODO: replace {cwd: '.'} with multiContext.cwd
	if (pkg.name) tagFilters.push(pkg.name);
	if (!tags || !tags.length) {
		tags = getTags(pkg._branch, { cwd: "." }, tagFilters);
	}
	const lastPreRelTag = getPreReleaseTag(lastVersion);
	const isNewPreRelTag = lastPreRelTag && lastPreRelTag !== pkg._preRelease;
	const versionToSet =
		isNewPreRelTag || !lastVersion
			? `1.0.0-${pkg._preRelease}.1`
			: _nextPreVersionCases(
					tags.map((tag) => getVersionFromTag(pkg, tag)).filter((tag) => tag),
					lastVersion,
					pkg._nextType,
					pkg._preRelease
			  );
	return versionToSet;
};

/**
 * Parse the prerelease tag from a semver version.
 *
 * @param {string} version Semver version in a string format.
 * @returns {string|null} preReleaseTag Version prerelease tag or null.
 * @internal
 */
const getPreReleaseTag = (version) => {
	const parsed = semver.parse(version);
	if (!parsed) return null;
	return parsed.prerelease[0] || null;
};

/**
 * Resolve next prerelease special cases: highest version from tags or major/minor/patch.
 *
 * @param {Array} tags List of all released tags from package.
 * @param {string} lastVersion Last package version released.
 * @param {string} pkgNextType Next type evaluated for the next package type.
 * @param {string} pkgPreRelease Package prerelease suffix.
 * @returns {string|undefined} Next pkg version.
 * @internal
 */
const _nextPreVersionCases = (tags, lastVersion, pkgNextType, pkgPreRelease) => {
	// Case 1: Normal release on last version and is now converted to a prerelease
	if (!semver.prerelease(lastVersion)) {
		const { major, minor, patch } = semver.parse(lastVersion);
		return `${semver.inc(`${major}.${minor}.${patch}`, pkgNextType || "patch")}-${pkgPreRelease}.1`;
	}

	// Case 2: Validates version with tags
	const latestTag = getLatestVersion(tags, { withPrerelease: true });
	return _nextPreHighestVersion(latestTag, lastVersion, pkgPreRelease);
};

/**
 * Resolve next prerelease comparing bumped tags versions with last version.
 *
 * @param {string|null} latestTag Last released tag from branch or null if non-existent.
 * @param {string} lastVersion Last version released.
 * @param {string} pkgPreRelease Prerelease tag from package to-be-released.
 * @returns {string} Next pkg version.
 * @internal
 */
const _nextPreHighestVersion = (latestTag, lastVersion, pkgPreRelease) => {
	const bumpFromTags = latestTag ? semver.inc(latestTag, "prerelease", pkgPreRelease) : null;
	const bumpFromLast = semver.inc(lastVersion, "prerelease", pkgPreRelease);

	return bumpFromTags ? getHighestVersion(bumpFromLast, bumpFromTags) : bumpFromLast;
};

/**
 * Returns the 'highest' type of release update, major > minor > patch > undefined.
 * @param  {...string} releaseTypes types (patch | minor | major | undefined) of which the highest to return.
 * @returns {string | undefined} release type considered highest
 */
const getHighestReleaseType = (...releaseTypes) =>
	["major", "minor", "patch"].find((type) => releaseTypes.includes(type));

/**
 * Resolve package release type taking into account the cascading dependency update.
 *
 * @param {Package} pkg Package object.
 * @param {string|undefined} bumpStrategy Dependency resolution strategy: override, satisfy, inherit.
 * @param {string|undefined} releaseStrategy Release type triggered by deps updating: patch, minor, major, inherit.
 * @returns {string|undefined} Resolved release type.
 * @internal
 */
const resolveReleaseType = (pkg, bumpStrategy = "override", releaseStrategy = "patch") => {
	// Define release type for dependent package if any of its deps changes.
	// `patch`, `minor`, `major` — strictly declare the release type that occurs when any dependency is updated.
	// `inherit` — applies the "highest" release of updated deps to the package.
	// For example, if any dep has a breaking change, `major` release will be applied to the all dependants up the chain.

	//create a list of dependencies that require change to the manifest
	pkg._depsChanged = pkg.localDeps.filter((d) => needsDependencyUpdate(pkg, d, bumpStrategy));

	//check if any dependencies have changed. If not return the current type of release
	if (
		!pkg._lastRelease || //not released yet
		pkg._depsChanged.length === 0 || //no deps available
		pkg._depsChanged.every((dep) => dep._lastRelease && !dep._nextType) //no new deps or deps upgraded
	) {
		return pkg._nextType;
	}

	//find highest release type if strategy is inherit, starting of type set by commit analyzer
	if (releaseStrategy === "inherit") {
		return getHighestReleaseType(pkg._nextType, ...pkg._depsChanged.map((d) => d._nextType));
	}

	//set to highest of commit analyzer found change and releaseStrategy
	//releaseStrategy of major could override local update of minor
	return getHighestReleaseType(pkg._nextType, releaseStrategy);
};

/**
 * Indicates if the manifest file requires a change for the given dependency
 * @param {Package} pkg Package object.
 * @param {Package} dependency dependency to check
 * @param {string|undefined} bumpStrategy Dependency resolution strategy: override, satisfy, inherit.
 * @returns {boolean } true if dependency needs to change
 */
const needsDependencyUpdate = (pkg, dependency, bumpStrategy) => {
	//get last release of dependency
	const depLastVersion = dependency._lastRelease && dependency._lastRelease.version;

	//Check if dependency was released before (if not, this is assumed to be a new package + dependency)
	const wasReleased = depLastVersion !== undefined;
	if (!wasReleased) return true; //new packages always require a package re-release

	//get estimated next version of dependency (which is lastVersion if no change expected)
	const depNextVersion = dependency._nextType
		? dependency._preRelease
			? getNextPreVersion(dependency)
			: getNextVersion(dependency)
		: depLastVersion;

	//get list of manifest dependencies
	const { dependencies = {}, devDependencies = {}, peerDependencies = {}, optionalDependencies = {} } = pkg.manifest;
	const scopes = [dependencies, devDependencies, peerDependencies, optionalDependencies];

	//Check if the manifest dependency rules warrants an update (in any of the dependency scopes)
	const requireUpdate = scopes.some((scope) =>
		manifestUpdateNecessary(scope, dependency.name, depNextVersion, bumpStrategy)
	);

	//return if update is required
	return requireUpdate;
};

/**
 * Checks if an update of a package is necessary in the given list of dependencies, based on semantic versioning rules
 * and the bumpStrategy.
 * @param {Object} scope object containing dependencies. Dependency names are the keys, dependency rule the values.
 * @param {string} name name of the dependency to update
 * @param {string} nextVersion the new version of the dependency
 * @param {string} bumpStrategy Dependency resolution strategy: override, satisfy, inherit.
 * @returns {boolean} true if a the dependency exists in the scope and requires a version update
 */
const manifestUpdateNecessary = (scope, name, nextVersion, bumpStrategy) => {
	const currentVersion = scope[name];
	if (!nextVersion || !currentVersion) {
		return false;
	}

	//calculate the next version of the manifest dependency, given the current version
	//this checks the semantic versioning rules. Resolved version will remain
	//current version if the currentVersion "encompasses" the next version
	const resolvedVersion = resolveNextVersion(currentVersion, nextVersion, bumpStrategy);

	return currentVersion !== resolvedVersion;
};

/**
 * Resolve next version of dependency based on bumpStrategy
 *
 * @param {string} currentVersion Current dep version
 * @param {string} nextVersion Next release type: patch, minor, major
 * @param {string|undefined} bumpStrategy Resolution strategy: inherit, override, satisfy
 * @returns {string} Next dependency version
 * @internal
 */
const resolveNextVersion = (currentVersion, nextVersion, bumpStrategy = "override") => {
	//no change...
	if (currentVersion === nextVersion) return currentVersion;

	// Check the next pkg version against its current references.
	// If it matches (`*` matches to any, `1.1.0` matches `1.1.x`, `1.5.0` matches to `^1.0.0` and so on)
	// release will not be triggered, if not `override` strategy will be applied instead.
	if ((bumpStrategy === "satisfy" || bumpStrategy === "inherit") && semver.satisfies(nextVersion, currentVersion)) {
		return currentVersion;
	}

	// `inherit` will try to follow the current declaration version/range.
	// `~1.0.0` + `minor` turns into `~1.1.0`, `1.x` + `major` gives `2.x`,
	// but `1.x` + `minor` gives `1.x` so there will be no release, etc.
	if (bumpStrategy === "inherit") {
		const sep = ".";
		const nextChunks = nextVersion.split(sep);
		const currentChunks = currentVersion.split(sep);
		// prettier-ignore
		const resolvedChunks = currentChunks.map((chunk, i) =>
			nextChunks[i]
				? chunk.replace(/\d+/, nextChunks[i])
				: chunk
		);

		return resolvedChunks.join(sep);
	}

	// "override"
	// By default next package version would be set as is for the all dependants.
	return nextVersion;
};

/**
 * Update pkg deps.
 *
 * @param {Package} pkg The package this function is being called on.
 * @param {boolean} writeOut Commit the package to the file store (set to false to suppres)
 * @returns {undefined}
 * @internal
 */
const updateManifestDeps = (pkg, writeOut = true) => {
	const { manifest, path } = pkg;

	// Loop through changed deps to verify release consistency.
	pkg._depsChanged.forEach((dependency) => {
		// Get version of dependency.
		const release = dependency._nextRelease || dependency._lastRelease;

		// Cannot establish version.
		if (!release || !release.version)
			throw Error(`Cannot release because dependency ${dependency.name} has not been released`);

		//update changed dependencies
		const {
			dependencies = {},
			devDependencies = {},
			peerDependencies = {},
			optionalDependencies = {},
		} = pkg.manifest;
		const scopes = [dependencies, devDependencies, peerDependencies, optionalDependencies];
		scopes.forEach((scope) => {
			if (scope[dependency.name]) scope[dependency.name] = release.version;
		});
	});

	if (!writeOut || !auditManifestChanges(manifest, path)) {
		return;
	}

	// Write package.json back out.
	const { indent, trailingWhitespace } = recognizeFormat(manifest.__contents__);
	writeFileSync(path, JSON.stringify(manifest, null, indent) + trailingWhitespace);
};

// https://gist.github.com/Yimiprod/7ee176597fef230d1451
const difference = (object, base) =>
	transform(object, (result, value, key) => {
		if (!isEqual(value, base[key])) {
			result[key] =
				isObject(value) && isObject(base[key]) ? difference(value, base[key]) : `${base[key]} → ${value}`;
		}
	});

/**
 * Clarify what exactly was changed in manifest file.
 * @param {object} actualManifest manifest object
 * @param {string} path manifest path
 * @returns {boolean} has changed or not
 * @internal
 */
const auditManifestChanges = (actualManifest, path) => {
	const debugPrefix = `[${actualManifest.name}]`;
	const oldManifest = getManifest(path);
	const depScopes = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
	const changes = depScopes.reduce((res, scope) => {
		const diff = difference(actualManifest[scope], oldManifest[scope]);

		if (Object.keys(diff).length) {
			res[scope] = diff;
		}

		return res;
	}, {});

	debug(debugPrefix, "package.json path=", path);

	if (Object.keys(changes).length) {
		debug(debugPrefix, "changes=", changes);
		return true;
	}

	debug(debugPrefix, "no deps changes");
	return false;
};

module.exports = {
	getNextVersion,
	getNextPreVersion,
	getPreReleaseTag,
	updateManifestDeps,
	resolveReleaseType,
	resolveNextVersion,
	getVersionFromTag,
};
