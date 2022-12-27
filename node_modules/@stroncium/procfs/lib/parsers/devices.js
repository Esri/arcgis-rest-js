const {splitLines, unescape} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let type;
	let devices = [];
	for (let i = 0; i < ls.length; i++) {
		let l = ls[i].trim();
		let major = parseInt(l);
		if (Number.isNaN(major)) {
			l = l.toLowerCase();
			if (l.startsWith('character')) {
				type = 'character';
			} else if (l.startsWith('block')) {
				type = 'block';
			}
		} else {
			let dev = {
				major,
				group: unescape(l.split(' ').slice(1).join(' ')),
				type,
			};
			devices.push(dev);
		}
	}
	return devices;
};
