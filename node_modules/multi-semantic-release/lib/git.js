const execa = require("execa");

/**
 * Get all the tags for a given branch.
 *
 * @param {String} branch The branch for which to retrieve the tags.
 * @param {Object} [execaOptions] Options to pass to `execa`.
 * @param {Array<String>} filters List of prefixes/sufixes to be checked inside tags.
 *
 * @return {Array<String>} List of git tags.
 * @throws {Error} If the `git` command fails.
 * @internal
 */
function getTags(branch, execaOptions, filters) {
	let tags = execa.sync("git", ["tag", "--merged", branch], execaOptions).stdout;
	tags = tags
		.split("\n")
		.map((tag) => tag.trim())
		.filter(Boolean);

	if (!filters || !filters.length) return tags;

	const validateSubstr = (t, f) => !!f.find((v) => t.includes(v));

	return tags.filter((tag) => validateSubstr(tag, filters));
}

/**
 * Get the commit sha for a given tag.
 *
 * @param {String} tagName Tag name for which to retrieve the commit sha.
 * @param {Object} [execaOptions] Options to pass to `execa`.
 *
 * @return {Promise<String>} The commit sha of the tag in parameter or `null`.
 */
async function getTagHead(tagName, execaOptions) {
	return (await execa("git", ["rev-list", "-1", tagName], execaOptions)).stdout;
}

module.exports = {
	getTags,
	getTagHead,
};
