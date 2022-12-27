const {RE_WS, splitLines} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	for (let i = 0; i < ls.length; i++) {
		let ps = ls[i].trim().split(RE_WS);
		ls[i] = {
			targetStart: parseInt(ps[0]),
			start: parseInt(ps[1]),
			length: parseInt(ps[2]),
		};
	}
	return ls;
};
