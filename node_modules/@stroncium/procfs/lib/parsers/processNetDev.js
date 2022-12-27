const {splitLines, RE_WS} = require('./utils');

module.exports = src => {
	let ls = splitLines(src, '\n');
	let devs = [];
	for (let i = 2; i < ls.length; i++) {
		let ps = ls[i].trim().split(RE_WS);
		let name = ps[0];
		name = name.substr(0, name.length - 1);
		devs[i - 2] = {
			name,
			rxBytes: parseInt(ps[1]),
			rxPackets: parseInt(ps[2]),
			rxErrors: parseInt(ps[3]),
			rxDrop: parseInt(ps[4]),
			rxFifo: parseInt(ps[5]),
			rxFrame: parseInt(ps[6]),
			rxCompressed: parseInt(ps[7]),
			rxMulticast: parseInt(ps[8]),
			txBytes: parseInt(ps[9]),
			txPackets: parseInt(ps[10]),
			txErrors: parseInt(ps[11]),
			txDrop: parseInt(ps[12]),
			txFifo: parseInt(ps[13]),
			txColls: parseInt(ps[14]),
			txCarrier: parseInt(ps[15]),
			txCompressed: parseInt(ps[16]),
		};
	}
	return devs;
};
