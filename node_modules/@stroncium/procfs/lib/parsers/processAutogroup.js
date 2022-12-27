module.exports = src => {
	let ps = src.split(' ');
	return {
		name: ps[0],
		nice: parseInt(ps[2]),
	};
};
