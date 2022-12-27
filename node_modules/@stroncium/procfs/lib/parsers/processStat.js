module.exports = src => {
	let idx1 = src.indexOf('(');
	let idx2 = src.lastIndexOf(')');
	let ps = src.substr(idx2 + 2).split(' ');
	return {
		pid: parseInt(src),
		comm: unescape(src.substr(idx1 + 1, idx2 - idx1 - 1)),
		state: ps[0],
		parent: parseInt(ps[1]),
		processGroup: parseInt(ps[2]),
		session: parseInt(ps[3]),
		tty: parseInt(ps[4]),
		terminalProcessGroup: parseInt(ps[5]),
		flags: parseInt(ps[6]),
		minorFaults: parseInt(ps[7]),
		childMinorFaults: parseInt(ps[8]),
		majorFaults: parseInt(ps[9]),
		childMajorFaults: parseInt(ps[10]),
		userTicks: parseInt(ps[11]),
		kernelTicks: parseInt(ps[12]),
		childUserTicks: parseInt(ps[13]),
		childKernelTicks: parseInt(ps[14]),
		priority: parseInt(ps[15]),
		nice: parseInt(ps[16]),
		threads: parseInt(ps[17]),
		startTicks: parseInt(ps[19]),
		vsize: parseInt(ps[20]),
		rss: parseInt(ps[21]),
		rssSoftLimit: parseInt(ps[22]),
		exitSignal: parseInt(ps[35]),
		lastCpu: parseInt(ps[36]),
		realtimePriority: parseInt(ps[37]),
		schedulingPolicy: parseInt(ps[38]),
		blockIoTicks: parseInt(ps[39]),
		guestTicks: parseInt(ps[40]),
		childGuestTicks: parseInt(ps[41]),
	};
};
