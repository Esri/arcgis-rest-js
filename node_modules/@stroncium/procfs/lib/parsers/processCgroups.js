const {splitLines} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	for (let i = 0; i < ls.length; i++) {
		let ps = ls[i].split(':');
		const hierarchyId = parseInt(ps[0]);
		let controllers;
		if (hierarchyId !== 0) {
			/* istanbul ignore if not sure if it is possible */
			if (ps[1].length === 0) {
				controllers = [];
			} else {
				controllers = ps[1].split(',');
			}
		}
		ls[i] = {
			hierarchyId,
			controllers,
			path: ps[2],
		};
	}
	return ls;
};
