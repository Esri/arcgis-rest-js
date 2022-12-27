module.exports = src => {
	let fds = [];
	for (let i = 0; i < src.length; i++) {
		fds[i] = parseInt(src[i]);
	}
	return fds;
};
