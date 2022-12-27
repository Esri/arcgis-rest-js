const {devIdFromMajorMinor} = require('../utils');
const {splitLines, unescape} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	for (let i = 0; i < ls.length; i++) {
		let ps = ls[i].split(' ');
		let optionalFields = [];
		let j;
		for (j = 6; ps[j] !== '-'; j++) {
			optionalFields.push(ps[j]);
		}
		let devParts = ps[2].split(':');
		let devId = devIdFromMajorMinor(parseInt(devParts[0]), parseInt(devParts[1]));
		ls[i] = {
			mountId: parseInt(ps[0]),
			parentId: parseInt(ps[1]),
			devId,
			root: unescape(ps[3]),
			mountPoint: unescape(ps[4]),
			mountOptions: ps[5].split(','),
			optionalFields,
			type: ps[j + 1],
			mountSource: ps[j + 2],
			superOptions: ps[j + 3].split(','),
		};
	}
	return ls;
};
