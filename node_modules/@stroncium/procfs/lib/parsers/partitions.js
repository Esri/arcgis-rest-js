const {devIdFromMajorMinor} = require('../utils');
const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let dstIdx = 0;
	for (let i = 1; i < ls.length; i++) {
		let l = ls[i].trim();
		if (l === '') {
			continue;
		}
		let ps = l.trim().split(RE_WS);
		ls[dstIdx++] = {
			devId: devIdFromMajorMinor(parseInt(ps[0]), parseInt(ps[1])),
			blocks: parseInt(ps[2]),
			name: ps[3],
		};
	}
	ls.length = dstIdx;
	return ls;
};
