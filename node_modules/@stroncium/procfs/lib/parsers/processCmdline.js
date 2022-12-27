const {splitLines} = require('./utils');

module.exports = src => {
	return src.length === 0 ? null : splitLines(src, '\x00');
};
