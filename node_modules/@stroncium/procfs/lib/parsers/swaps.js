const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let dstIdx = 0;
	for (let i = 1; i < ls.length; i++) {
		let ps = ls[i].split(RE_WS);
		ls[dstIdx++] = {
			path: unescape(ps[0]),
			type: ps[1],
			size: parseInt(ps[2]),
			used: parseInt(ps[3]),
			priority: parseInt(ps[4]),
		};
	}
	ls.length = dstIdx;
	return ls;
};
