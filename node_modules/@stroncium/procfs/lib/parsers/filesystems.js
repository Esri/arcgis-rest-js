const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	for (let i = 0; i < ls.length; i++) {
		let ps = ls[i].trim().split(RE_WS);
		let nodev = ps.length === 2;
		ls[i] = {requiresBlockDevice: !nodev, name: ps[nodev ? 1 : 0]};
	}
	return ls;
};
