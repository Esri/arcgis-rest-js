module.exports = src => {
	let threads = [];
	for (let i = 0; i < src.length; i++) {
		threads[i] = parseInt(src[i]);
	}
	return threads;
};
