const ProcfsError = require('../procfs-error');
const {parseObject} = require('./utils');

const parseWithUnit = v => {
	if (v.endsWith(' kB')) {
		return parseInt(v) * 1024;
	}
	throw ProcfsError.parsingError(v, 'unknown unit');
};

const meminfoMap = new Map([
	['MemTotal', (obj, v) => obj.total = parseWithUnit(v)],
	['MemFree', (obj, v) => obj.free = parseWithUnit(v)],
	['MemAvailable', (obj, v) => obj.available = parseWithUnit(v)],
	['Buffers', (obj, v) => obj.buffers = parseWithUnit(v)],
	['Cached', (obj, v) => obj.cached = parseWithUnit(v)],
	['SwapCached', (obj, v) => obj.swapCached = parseWithUnit(v)],
	['Active', (obj, v) => obj.active = parseWithUnit(v)],
	['Inactive', (obj, v) => obj.inactive = parseWithUnit(v)],
	['SwapTotal', (obj, v) => obj.swapTotal = parseWithUnit(v)],
	['SwapFree', (obj, v) => obj.swapFree = parseWithUnit(v)],
	['Dirty', (obj, v) => obj.dirty = parseWithUnit(v)],
	['Writeback', (obj, v) => obj.writeback = parseWithUnit(v)],
	['AnonPages', (obj, v) => obj.anonPages = parseWithUnit(v)],
	['Mapped', (obj, v) => obj.mapped = parseWithUnit(v)],
	['Shmem', (obj, v) => obj.shmem = parseWithUnit(v)],
	['KReclaimable', (obj, v) => obj.kernelReclaimable = parseWithUnit(v)],
	['Slab', (obj, v) => obj.slab = parseWithUnit(v)],
	['SReclaimable', (obj, v) => obj.slabReclaimable = parseWithUnit(v)],
	['SUnreclaim', (obj, v) => obj.slabUnreclaimable = parseWithUnit(v)],
	['KernelStack', (obj, v) => obj.kernelStack = parseWithUnit(v)],
	['PageTables', (obj, v) => obj.pageTables = parseWithUnit(v)],
	['Bounce', (obj, v) => obj.bounceBuffers = parseWithUnit(v)],
	['WritebackTmp', (obj, v) => obj.writebackTmp = parseWithUnit(v)],
	['CommitLimit', (obj, v) => obj.commitLimit = parseWithUnit(v)],
	['VmallocTotal', (obj, v) => obj.vmallocTotal = parseWithUnit(v)],
	['HardwareCorrupted', (obj, v) => obj.hardwareCorrupted = parseWithUnit(v)],
	['AnonHugePages', (obj, v) => obj.anonHugePages = parseWithUnit(v)],
	['ShmemHugePages', (obj, v) => obj.shmemHugePages = parseWithUnit(v)],
	['ShmemPmdMapped', (obj, v) => obj.shmemPmdMapped = parseWithUnit(v)],
	['Hugepagesize', (obj, v) => obj.hugepageSize = parseWithUnit(v)],
	['DirectMap4k', (obj, v) => obj.directMap4K = parseWithUnit(v)],
	['DirectMap2M', (obj, v) => obj.directMap2M = parseWithUnit(v)],
	['DirectMap4M', (obj, v) => obj.directMap4M = parseWithUnit(v)],
	['DirectMap1G', (obj, v) => obj.directMap1G = parseWithUnit(v)],

	['HugePages_Total', (obj, v) => obj.hugepagesTotal = parseInt(v)],
	['HugePages_Free', (obj, v) => obj.hugepagesFree = parseInt(v)],
	['HugePages_Rsvd', (obj, v) => obj.hugepagesReserved = parseInt(v)],
	['HugePages_Surp', (obj, v) => obj.hugepagesSurplus = parseInt(v)],
]);

module.exports = src => parseObject(src, meminfoMap, {directMap4K: 0, directMap2M: 0, directMap4M: 0, directMap1G: 0});
