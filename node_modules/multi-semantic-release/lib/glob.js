const globby = require("globby");

module.exports = (...args) => {
	const [pattern, ...options] = args;

	return globby.sync(pattern, ...options);
};
