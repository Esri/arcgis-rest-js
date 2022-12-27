const {splitTwo} = require('./utils');

module.exports = src => {
	let ps = src.split(' ');
	let entities = splitTwo(ps[3], '/');
	return {
		jobsAverage1Minute: parseFloat(ps[0]),
		jobsAverage5Minutes: parseFloat(ps[1]),
		jobsAverage15Minutes: parseFloat(ps[2]),
		runnableEntities: parseInt(entities.left),
		existingEntities: parseInt(entities.right),
		mostRecentlyCreatedPid: parseInt(ps[4]),
	};
};
