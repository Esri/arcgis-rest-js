const ProcfsError = require('../procfs-error');

const splitLines = (str, eol) => {
	const eolLen = eol.length;
	let arr = [];
	let i = 0;
	let lastIdx = 0;
	let idx;
	while ((idx = str.indexOf(eol, lastIdx)) !== -1) {
		arr[i++] = str.substr(lastIdx, idx - lastIdx);
		lastIdx = idx + eolLen;
	}
	return arr;
};

const splitTwo = (str, sep, allowOne, defaultRight) => {
	let i = str.indexOf(sep);
	let left;
	let right;
	if (i === -1) {
		if (!allowOne) {
			throw ProcfsError.parsingError(str, `expected separator "${sep}"`);
		}
		left = str;
		right = defaultRight;
	} else {
		left = str.substr(0, i);
		right = str.substr(i + sep.length);
	}
	return {left, right};
};

const unescape = str => {
	let idx = str.indexOf('\\');
	if (idx === -1) {
		return str;
	}
	let res = '';
	let lastIdx = 0;
	do {
		res += str.substr(lastIdx, idx - lastIdx);
		res += String.fromCharCode(parseInt(str.substr(idx + 1, 3), 8));
		lastIdx = idx + 4;
	} while ((idx = str.indexOf('\\', lastIdx)) !== -1);
	res += str.substr(lastIdx);
	return res;
};

const parseObject = (src, map, obj) => {
	if (obj === undefined) {
		obj = {};
	}
	let ls = Array.isArray(src) ? src : src.split('\n');
	for (let l of ls) {
		if (l !== '') {
			let idx = l.indexOf(':');
			let key = l.substr(0, idx);
			let val = l.substr(idx + 1).trim();
			let setter = map.get(key);
			if (setter === undefined) {
				key = key.trim();
				setter = map.get(key);
			}
			if (setter === undefined) {
				continue;
			}
			setter(obj, val);
		}
	}
	return obj;
};

const parseObjects = (src, map) => {
	let gs = splitLines(src, '\n\n');
	for (let i = 0; i < gs.length; i++) {
		gs[i] = parseObject(gs[i], map);
	}
	return gs;
};

const RE_WS = /\s+/g;
const RE_LONG_WS = /\s\s+/g;

module.exports = {
	splitLines,
	splitTwo,
	parseObject,
	parseObjects,
	unescape,
	RE_WS,
	RE_LONG_WS,
};
