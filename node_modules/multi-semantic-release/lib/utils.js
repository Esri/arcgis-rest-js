/**
 * Lifted and tweaked from semantic-release because we follow how they bump their packages/dependencies.
 * https://github.com/semantic-release/semantic-release/blob/master/lib/utils.js
 */

const { gt, lt, prerelease, rcompare } = require("semver");

/**
 * Get tag objects and convert them to a list of stringified versions.
 * @param {array} tags Tags as object list.
 * @returns {array} Tags as string list.
 * @internal
 */
function tagsToVersions(tags) {
	if (!tags) return [];
	return tags.map(({ version }) => version);
}

/**
 * HOC that applies highest/lowest semver function.
 * @param {Function} predicate High order function to be called.
 * @param {string|undefined} version1 Version 1 to be compared with.
 * @param {string|undefined} version2 Version 2 to be compared with.
 * @returns {string|undefined} Highest or lowest version.
 * @internal
 */
const _selectVersionBy = (predicate, version1, version2) => {
	if (predicate && version1 && version2) {
		return predicate(version1, version2) ? version1 : version2;
	}
	return version1 || version2;
};

/**
 * Gets highest semver function binding gt to the HOC selectVersionBy.
 */
const getHighestVersion = _selectVersionBy.bind(null, gt);

/**
 * Gets lowest semver function binding gt to the HOC selectVersionBy.
 */
const getLowestVersion = _selectVersionBy.bind(null, lt);

/**
 * Retrieve the latest version from a list of versions.
 * @param {array} versions Versions as string list.
 * @param {bool|undefined} withPrerelease Prerelease flag.
 * @returns {string|undefined} Latest version.
 * @internal
 */
function getLatestVersion(versions, withPrerelease) {
	return versions.filter((version) => withPrerelease || !prerelease(version)).sort(rcompare)[0];
}

module.exports = {
	tagsToVersions,
	getHighestVersion,
	getLowestVersion,
	getLatestVersion,
};
