const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let sockets = [];
	for (let i = 1; i < ls.length; i++) {
		let ps = ls[i].trim().split(RE_WS);

		let la = ps[1].split(':');
		let ra = ps[2].split(':');
		let queues = ps[4].split(':');

		let socket = {
			slot: parseInt(ps[0]),
			localAddress: la[0],
			localPort: parseInt(la[1], 16),
			remoteAddress: ra[0],
			remotePort: parseInt(ra[1], 16),
			txQueue: parseInt(queues[0], 16),
			rxQueue: parseInt(queues[1], 16),
			uid: parseInt(ps[7]),
		};
		sockets[i - 1] = socket;
	}
	return sockets;
};
