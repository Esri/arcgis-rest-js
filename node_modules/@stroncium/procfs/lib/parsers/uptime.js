module.exports = src => {
	let ps = src.split(' ');
	return {
		time: parseFloat(ps[0]),
		idle: parseFloat(ps[1]),
	};
};
