const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let devs = [];
	for (let i = 2; i < ls.length; i++) {
		let ps = ls[i].trim().split(RE_WS);
		let name = ps[0];
		name = name.substr(0, name.length - 1);
		devs[i - 2] = {
			name,
			link: parseFloat(ps[2]),
			level: parseFloat(ps[3]),
			noise: parseFloat(ps[4]),
			discardedNwid: parseInt(ps[5]),
			discardedCrypt: parseInt(ps[6]),
			discardedFrag: parseInt(ps[7]),
			discardedRetry: parseInt(ps[8]),
			discardedMisc: parseInt(ps[9]),
			missedBeacons: parseInt(ps[10]),
		};
	}
	return devs;
};
