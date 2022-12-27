module.exports = src => {
	let ls = [];
	let dstIdx = 0;
	for (let i = 0; i < src.length; i++) {
		let l = src[i];
		let ch = l.charCodeAt(0);
		if (ch >= 48 && ch <= 57) {
			ls[dstIdx++] = parseInt(src[i]);
		}
	}
	return ls;
};
