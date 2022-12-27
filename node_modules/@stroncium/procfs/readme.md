# procfs [![Build Status](https://travis-ci.com/stroncium/nodejs-procfs.svg?branch=master)](https://travis-ci.com/stroncium/nodejs-procfs) [![codecov](https://codecov.io/gh/stroncium/nodejs-procfs/branch/master/graph/badge.svg)](https://codecov.io/gh/stroncium/nodejs-procfs)

Zero dependency library for reading and parsing various files from `procfs` for Node.js, implemented in pure JS.

Linux implements `procfs` filesystem mounted at `/proc`(usually). This filesystem is virtual, and can be used to extract various information about kernel state and running processes.

Compatible with releases of Linux since 4.4 SLTS. Attempts to support new features from all the following releases. Features which are deprecated/discontinued in latest releases are not supported. Some features aren't expected to be used from Node.js and so were not implemented, if you need to use some of them, please open a feature request.

## Example

`npm install @stroncium/procfs`

```js
const {
	procfs,
	ProcfsError,
} = require('procfs');

console.log(procfs.uptime()); // { time: 2514423.82, idle: 9658533.16 }

console.log(procfs.processIo()); // { read: 66191, write: 147816, readSyscalls: 176, writeSyscalls: 498, readReal: 9805824, writeReal: 49152, writeCancelled: 0 }

let targetPid = 12345;

try {
	procfs.processIo(targetPid);
} catch (error) {
	if(error.code === ProcfsError.ERR_NOT_FOUND) {
		console.log('process ${targetPid} does not exist');
	}
}
```

## API

Full version of API is available in [API.md](https://github.com/stroncium/nodejs-procfs/blob/master/API.md).

Currently, the folowing `procfs` paths are supported by the library:
 - `/proc/*`: [procfs.processes](API.md#processes())
 - `/proc/<pid>/autogroup`: [procfs.processAutogroup](API.md#processAutogroup-pid)
 - `/proc/<pid>/cgroups`: [procfs.processCgroups](API.md#processCgroups-pid)
 - `/proc/<pid>/cmdline`: [procfs.processCmdline](API.md#processCmdline-pid)
 - `/proc/<pid>/comm`: [procfs.processComm](API.md#processComm-pid)
 - `/proc/<pid>/cpuset`: [procfs.processCpuset](API.md#processCpuset-pid)
 - `/proc/<pid>/cwd`: [procfs.processCwd](API.md#processCwd-pid)
 - `/proc/<pid>/environ`: [procfs.processEnviron](API.md#processEnviron-pid)
 - `/proc/<pid>/exe`: [procfs.processExe](API.md#processExe-pid)
 - `/proc/<pid>/fd/*`: [procfs.processFds](API.md#processFds-pid)
 - `/proc/<pid>/fd/<fd>`: [procfs.processFd](API.md#processFd-fd-pid)
 - `/proc/<pid>/fdinfo/<fd>`: [procfs.processFdinfo](API.md#processFdinfo-fd-pid)
 - `/proc/<pid>/gid_map`: [procfs.processGidMap](API.md#processGidMap-pid)
 - `/proc/<pid>/io`: [procfs.processIo](API.md#processIo-pid)
 - `/proc/<pid>/limits`: [procfs.processLimits](API.md#processLimits-pid)
 - `/proc/<pid>/mountinfo`: [procfs.processMountinfo](API.md#processMountinfo-pid)
 - `/proc/<pid>/net/dev`: [procfs.processNetDev](API.md#processNetDev-pid)
 - `/proc/<pid>/net/tcp6`: [procfs.processNetTcp6](API.md#processNetTcp6-pid)
 - `/proc/<pid>/net/tcp`: [procfs.processNetTcp4](API.md#processNetTcp4-pid)
 - `/proc/<pid>/net/udp6`: [procfs.processNetUdp6](API.md#processNetUdp6-pid)
 - `/proc/<pid>/net/udp`: [procfs.processNetUdp4](API.md#processNetUdp4-pid)
 - `/proc/<pid>/net/unix`: [procfs.processNetUnix](API.md#processNetUnix-pid)
 - `/proc/<pid>/net/wireless`: [procfs.processNetWireless](API.md#processNetWireless-pid)
 - `/proc/<pid>/oom_score`: [procfs.processOomScore](API.md#processOomScore-pid)
 - `/proc/<pid>/personality`: [procfs.processPersonality](API.md#processPersonality-pid)
 - `/proc/<pid>/stat`: [procfs.processStat](API.md#processStat-pid)
 - `/proc/<pid>/statm`: [procfs.processStatm](API.md#processStatm-pid)
 - `/proc/<pid>/status`: [procfs.processStatus](API.md#processStatus-pid)
 - `/proc/<pid>/task/*`: [procfs.processThreads](API.md#processThreads-pid)
 - `/proc/<pid>/timerslack_ns`: [procfs.processTimerslackNs](API.md#processTimerslackNs-pid)
 - `/proc/<pid>/uid_map`: [procfs.processUidMap](API.md#processUidMap-pid)
 - `/proc/cgroups`: [procfs.cgroups](API.md#cgroups())
 - `/proc/cmdline`: [procfs.cmdline](API.md#cmdline())
 - `/proc/config.gz`: [procfs.config](API.md#config())
 - `/proc/cpuinfo`: [procfs.cpuinfo](API.md#cpuinfo())
 - `/proc/devices`: [procfs.devices](API.md#devices())
 - `/proc/diskstats`: [procfs.diskstats](API.md#diskstats())
 - `/proc/filesystems`: [procfs.filesystems](API.md#filesystems())
 - `/proc/loadavg`: [procfs.loadavg](API.md#loadavg())
 - `/proc/meminfo`: [procfs.meminfo](API.md#meminfo())
 - `/proc/net/dev`: [procfs.netDev](API.md#netDev())
 - `/proc/net/tcp6`: [procfs.netTcp6](API.md#netTcp6())
 - `/proc/net/tcp`: [procfs.netTcp4](API.md#netTcp4())
 - `/proc/net/udp6`: [procfs.netUdp6](API.md#netUdp6())
 - `/proc/net/udp`: [procfs.netUdp4](API.md#netUdp4())
 - `/proc/net/unix`: [procfs.netUnix](API.md#netUnix())
 - `/proc/net/wireless`: [procfs.netWireless](API.md#netWireless())
 - `/proc/partitions`: [procfs.partitions](API.md#partitions())
 - `/proc/stat`: [procfs.stat](API.md#stat())
 - `/proc/swaps`: [procfs.swaps](API.md#swaps())
 - `/proc/uptime`: [procfs.uptime](API.md#uptime())
 - `/proc/version`: [procfs.version](API.md#version())

## Custom procfs path

```js
const {
	Procfs
} = require('procfs');

let procfs = new Procfs('/custom/proc');
console.log(procfs.uptime()); // { time: 2514423.82, idle: 9658533.16 }
```

## Performance
Good performance is considered one of the main goals of this library, but for some calls which aren't expected to be used frequently the parsing might be done in sub-optimal(but still quite performant) way. If you encounter a need for performance optimizations of some call, please open an issue.

Currently, all the IO is done synchronously, in most cases it is faster than asynchronous IO for `procfs`.
For many methods, synchronous IO is *always* faster than asynchronous, as time required to perform full read synchronously is smaller than *just initializing* asynchronous read structures. For others, it is on par. In case when a lot of relatively big files are read at the same time, asynchronous IO can be faster on multi-core systems, so introducing async versions of methods is considered for future versions.

## Development

`npm run test` to perform a test without updating docs nor type asserts.

`npm run fulltest` to `npm run build && npm run test`

`npm run build` builds `API.md` and type asserts for tests from `haxe/procfs/Procfs.hx`.
