const {devIdFromMajorMinor} = require('../utils');
const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	for (let i = 0; i < ls.length; i++) {
		let ps = ls[i].trim().split(RE_WS);
		ls[i] = {
			devId: devIdFromMajorMinor(parseInt(ps[0]), parseInt(ps[1])),
			name: ps[2],
			reads: parseInt(ps[3]),
			readsMerged: parseInt(ps[4]),
			sectorsRead: parseInt(ps[5]),
			readTime: parseInt(ps[6]),
			writes: parseInt(ps[7]),
			writesMerged: parseInt(ps[8]),
			sectorsWriten: parseInt(ps[9]),
			writeTime: parseInt(ps[10]),
			currentIoCount: parseInt(ps[11]),
			ioTime: parseInt(ps[12]),
			weightedIoTime: parseInt(ps[13]),
		};
	}
	return ls;
};
