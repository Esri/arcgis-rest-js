module.exports = src => {
	let ps = src.split(' ');
	return {
		size: parseInt(ps[0]),
		resident: parseInt(ps[1]),
		shared: parseInt(ps[2]),
		text: parseInt(ps[3]),
		data: parseInt(ps[5]),
	};
};
