const {splitLines, RE_LONG_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let limits = [];
	for (let i = 1; i < ls.length; i++) {
		let ps = ls[i].split(RE_LONG_WS);
		limits[i - 1] = {
			name: ps[0],
			soft: (ps[1] === 'unlimited') ? undefined : parseInt(ps[1]),
			hard: (ps[2] === 'unlimited') ? undefined : parseInt(ps[2]),
			units: ps[3] === '' ? undefined : ps[3].trim(),
		};
	}
	return limits;
};
