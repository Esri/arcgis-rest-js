'use strict';
const ProcfsError = require('./lib/procfs-error');
const parsers = require('./lib/parsers');
const {
	read,
	readLink,
	readBuffer,
	readdir,
	devIdGetMinor,
	devIdGetMajor,
	devIdFromMajorMinor,
} = require('./lib/utils');

class Procfs {
	constructor(root) {
		if (root === undefined) {
			root = '/proc';
		}
		this.root = root;
		this.rootSlash = `${root}/`;
	}

	processes() {
		try {
			return parsers.processes(readdir(this.root));
		} catch (error) {
			/* istanbul ignore next should not ever happen when procfs exists */
			throw ProcfsError.generic(error);
		}
	}

	processFds(pid) {
		if (pid !== undefined && (!Number.isInteger(pid) || pid <= 0)) {
			throw new TypeError('pid');
		}
		try {
			return parsers.processFds(readdir(`${this.rootSlash}${pid === undefined ? 'self' : pid}/fd`));
		} catch (error) {
			throw ProcfsError.generic(error);
		}
	}

	processThreads(pid) {
		if (pid !== undefined && (!Number.isInteger(pid) || pid <= 0)) {
			throw new TypeError('pid');
		}
		try {
			return parsers.processThreads(readdir(`${this.rootSlash}${pid === undefined ? 'self' : pid}/task`));
		} catch (error) {
			throw ProcfsError.generic(error);
		}
	}

	processFdinfo(fd, pid) {
		if (pid !== undefined && !(Number.isInteger(pid) && pid >= 0)) {
			throw new TypeError('pid');
		}
		if (!Number.isInteger(fd) || fd <= 0) {
			throw new TypeError('fd');
		}
		try {
			return parsers.processFdinfo(read(`${this.rootSlash}${pid === undefined ? 'self' : pid}/fdinfo/${fd}`));
		} catch (error) {
			throw ProcfsError.generic(error);
		}
	}

	processFd(fd, pid) {
		if (pid !== undefined && !(Number.isInteger(pid) && pid >= 0)) {
			throw new TypeError('pid');
		}
		if (!Number.isInteger(fd) || fd <= 0) {
			throw new TypeError('fd');
		}
		try {
			return parsers.processFd(readLink(`${this.rootSlash}${pid === undefined ? 'self' : pid}/fd/${fd}`));
		} catch (error) {
			throw ProcfsError.generic(error);
		}
	}

	config() {
		try {
			return parsers.config(readBuffer(`${this.rootSlash}config.gz`));
		} catch (error) {
			/* istanbul ignore next should not ever happen when procfs exists and kernel properly configured */
			throw ProcfsError.generic(error);
		}
	}
}

Procfs.prototype.devIdGetMinor = devIdGetMinor;
Procfs.prototype.devIdGetMajor = devIdGetMajor;
Procfs.prototype.devIdFromMajorMinor = devIdFromMajorMinor;

for (let [name, path] of [
	['processExe', '/exe'],
	['processCwd', '/cwd'],
]) {
	Procfs.prototype[name] = function (pid) {
		if (pid !== undefined && !(Number.isInteger(pid) && pid >= 0)) {
			throw new TypeError('pid');
		}
		try {
			return parsers[name](readLink(`${this.rootSlash}${pid === undefined ? 'self' : pid}${path}`));
		} catch (error) {
			throw ProcfsError.generic(error);
		}
	};
}

for (let [name, path] of [
	['processMountinfo', '/mountinfo'],
	['processIo', '/io'],
	['processUidMap', '/uid_map'],
	['processGidMap', '/gid_map'],
	['processEnviron', '/environ'],
	['processOomScore', '/oom_score'],
	['processTimerslackNs', '/timerslack_ns'],
	['processCmdline', '/cmdline'],
	['processAutogroup', '/autogroup'],
	['processStatm', '/statm'],
	['processComm', '/comm'],
	['processPersonality', '/personality'],
	['processCgroups', '/cgroup'],
	['processCpuset', '/cpuset'],
	['processLimits', '/limits'],
	['processStat', '/stat'],
	['processStatus', '/status'],
	['processNetDev', '/net/dev'],
	['processNetWireless', '/net/wireless'],
	['processNetUnix', '/net/unix'],
	['processNetTcp4', '/net/tcp'],
	['processNetTcp6', '/net/tcp6'],
	['processNetUdp4', '/net/udp'],
	['processNetUdp6', '/net/udp6'],
]) {
	Procfs.prototype[name] = function (pid) {
		if (pid !== undefined && !(Number.isInteger(pid) && pid >= 0)) {
			throw new TypeError('pid');
		}
		try {
			return parsers[name](read(`${this.rootSlash}${pid === undefined ? 'self' : pid}${path}`));
		} catch (error) {
			throw ProcfsError.generic(error);
		}
	};
}

for (let name of [
	'cpuinfo',
	'loadavg',
	'uptime',
	'version',
	'cmdline',
	'swaps',
	'stat',
	'devices',
	'filesystems',
	'diskstats',
	'partitions',
	'meminfo',
	'cgroups',
]) {
	Procfs.prototype[name] = function () {
		try {
			return parsers[name](read(this.rootSlash + name));
		} catch (error) {
			/* istanbul ignore next should not ever happen when procfs exists */
			throw ProcfsError.generic(error);
		}
	};
}

for (let [name, parser, path] of [
	['netDev', 'processNetDev', 'net/dev'],
	['netWireless', 'processNetWireless', 'net/wireless'],
	['netUnix', 'processNetUnix', 'net/unix'],
	['netTcp4', 'processNetTcp4', 'net/tcp'],
	['netTcp6', 'processNetTcp6', 'net/tcp6'],
	['netUdp4', 'processNetUdp4', 'net/udp'],
	['netUdp6', 'processNetUdp6', 'net/udp6'],
]) {
	Procfs.prototype[name] = function () {
		try {
			return parsers[parser](read(this.rootSlash + path));
		} catch (error) {
			/* istanbul ignore next should not ever happen when procfs exists */
			throw ProcfsError.generic(error);
		}
	};
}

const procfs = new Procfs();
module.exports = {
	procfs,
	Procfs,
	ProcfsError,
};
