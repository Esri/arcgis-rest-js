const {splitLines} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\x00');
	for (let i = 0; i < ls.length; i++) {
		let l = ls[i];
		let idx = l.indexOf('=');
		ls[i] = [l.substr(0, idx), l.substr(idx + 1)];
	}
	return ls;
};
