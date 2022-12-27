const {
	readlinkSync,
	readdirSync,
	openSync,
	readSync,
	closeSync,
	readFileSync,
	existsSync,
} = require('fs');

const tmpBufMinLen = 4096 * 2;
const tmpBufMaxLen = 4096 * 8;

let tmpBuf = Buffer.allocUnsafeSlow(tmpBufMinLen);

const read = path => {
	const fd = openSync(path, 'r', 0o666);
	let pos = 0;
	let bytesRead;
	let buf = tmpBuf;
	let length = buf.length;
	do {
		bytesRead = readSync(fd, buf, pos, buf.length - pos, null);
		pos += bytesRead;
		if (pos === tmpBuf.length) {
			length = length << 1;
			let newBuf = Buffer.allocUnsafeSlow(length);

			if (length <= tmpBufMaxLen) {
				tmpBuf = newBuf;
			}

			buf.copy(newBuf);
			buf = newBuf;
		}
	} while (bytesRead !== 0);
	closeSync(fd);
	return buf.toString('utf8', 0, pos);
};

const readIdList = path => {
	let ls = readdirSync(path);
	for (let i = 0; i < ls.length; i++) {
		ls[i] = parseInt(ls[i]);
	}
	return ls;
};

const readBuffer = readFileSync;
const exists = existsSync;
const readdir = readdirSync;

const devIdGetMinor = devId => (((devId >> 20) << 8) | (devId & 0xFF));
const devIdGetMajor = devId => ((devId >> 8) & 0xFF);
const devIdFromMajorMinor = (major, minor) => (((minor >> 8) << 20) | ((major & 0xFF) << 8) | (minor & 0xFF));

module.exports = {
	read,
	readLink: readlinkSync,
	readIdList,
	readBuffer,
	exists,
	readdir,

	devIdGetMinor,
	devIdGetMajor,
	devIdFromMajorMinor,
};
