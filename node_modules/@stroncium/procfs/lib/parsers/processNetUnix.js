const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let sockets = [];
	for (let i = 1; i < ls.length; i++) {
		let ps = ls[i].trim().split(RE_WS);
		let slot = ps[0];
		slot = slot.substr(0, slot.length - 1);
		let socket = {
			slot,
			referenceCount: parseInt(ps[1], 16),
			type: parseInt(ps[4], 16),
		};
		if (ps.length === 8) {
			socket.path = ps[7];
		}
		sockets[i - 1] = socket;
	}
	return sockets;
};
