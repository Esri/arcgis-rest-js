const {parseObjects} = require('./utils');

const parseYes = v => v === 'yes';

const cpuinfoMap = new Map([
	['processor', (obj, v) => obj.id = parseInt(v)],
	['stepping', (obj, v) => obj.stepping = parseInt(v)],
	['physical id', (obj, v) => obj.physicalId = parseInt(v)],
	['siblings', (obj, v) => obj.siblings = parseInt(v)],
	['core id', (obj, v) => obj.coreId = parseInt(v)],
	['cpu cores', (obj, v) => obj.cores = parseInt(v)],
	['apicid', (obj, v) => obj.apicId = parseInt(v)],
	['initial apicid', (obj, v) => obj.initialApicId = parseInt(v)],
	['cpuid level', (obj, v) => obj.cpuidLevel = parseInt(v)],
	['cache_alignment', (obj, v) => obj.cacheAlignment = parseInt(v)],
	['clflush size', (obj, v) => obj.clflushSize = parseInt(v)],
	['wp', (obj, v) => obj.wp = parseYes(v)],
	['fpu', (obj, v) => obj.fpu = parseYes(v)],
	['fpu_exception', (obj, v) => obj.fpuException = parseYes(v)],
	['bogomips', (obj, v) => obj.bogoMips = parseFloat(v)],
	['cpu MHz', (obj, v) => obj.cpuMhz = parseFloat(v)],
	['flags', (obj, v) => obj.flags = v === '' ? [] : v.split(' ')],
	['bugs', (obj, v) => obj.bugs = v === '' ? [] : v.split(' ')],
	['vendor_id', (obj, v) => obj.vendorId = v],
	['cpu family', (obj, v) => obj.family = parseInt(v)],
	['model', (obj, v) => obj.model = parseInt(v)],
	['model name', (obj, v) => obj.modelName = v.trim()],
	['microcode', (obj, v) => obj.microcode = v],
	['cache size', (obj, v) => obj.cacheSize = v],
	['address sizes', (obj, v) => obj.addressSizes = v],
]);

module.exports = src => parseObjects(src, cpuinfoMap);
