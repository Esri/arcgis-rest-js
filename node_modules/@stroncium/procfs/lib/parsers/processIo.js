const {parseObject} = require('./utils');

const ioMap = new Map([
	['rchar', (obj, v) => obj.read = parseInt(v)],
	['wchar', (obj, v) => obj.write = parseInt(v)],
	['syscr', (obj, v) => obj.readSyscalls = parseInt(v)],
	['syscw', (obj, v) => obj.writeSyscalls = parseInt(v)],
	['read_bytes', (obj, v) => obj.readReal = parseInt(v)],
	['write_bytes', (obj, v) => obj.writeReal = parseInt(v)],
	['cancelled_write_bytes', (obj, v) => obj.writeCancelled = parseInt(v)],
]);

module.exports = src => parseObject(src, ioMap);
