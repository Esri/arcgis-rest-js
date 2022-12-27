const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let controllers = [];
	for (let i = 1; i < ls.length; i++) {
		let ps = ls[i].split(RE_WS);
		controllers[i - 1] = {
			name: ps[0],
			hierarchyId: parseInt(ps[1]),
			cgroupsNumber: parseInt(ps[2]),
			enabled: ps[3] === '1',
		};
	}
	return controllers;
};
