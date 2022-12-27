const {splitLines} = require('./utils');

const parseCpuTime = ps => {
	return {
		user: ps[1],
		nice: ps[2],
		system: ps[3],
		idle: ps[4],
		iowait: ps[5],
		irq: ps[6],
		softirq: ps[7],
		steal: ps[8],
		guest: ps[9],
		guestNice: ps[10],
	};
};

module.exports = src => {
	let ls = splitLines(src, '\n');
	let cpuTime = [];
	let res = {
		cpuTime,
	};
	for (let l of ls) {
		let ps = l.split(' ');
		let dstIdx = 1;
		for (let i = 1; i < ps.length; i++) {
			let p = ps[i];
			if (p === '') {
				continue;
			}
			ps[dstIdx++] = parseInt(ps[i]);
		}
		switch (ps[0]) {
			case 'cpu':
				res.systemCpuTime = parseCpuTime(ps);
				break;
			case 'intr':
				res.interrupts = ps[1];
				res.numberedInterrupts = ps.slice(2);
				break;
			case 'ctxt':
				res.contextSwitches = ps[1];
				break;
			case 'btime':
				res.bootTime = new Date(1000 * ps[1]);
				break;
			case 'processes':
				res.forks = ps[1];
				break;
			case 'procs_running':
				res.processesRunning = ps[1];
				break;
			case 'procs_blocked':
				res.processesBlocked = ps[1];
				break;
			case 'softirq':
				res.softInterrupts = ps[1];
				res.numberedSoftInterrupts = ps.slice(2);
				break;
			default:
				if (ps[0].startsWith('cpu')) {
					cpuTime[parseInt(ps[0].substr(3))] = parseCpuTime(ps);
				}
		}
	}
	return res;
};
