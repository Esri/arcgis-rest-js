'use strict';
const execa = require('execa');

const getColumnBoundaries = async header => {
	// Regex captures each individual column
	// ^\S+\s+       -> First column
	// \s*\S+\s*\S+$ -> Last column (combined)
	// \s*\S+        -> Regular columns
	const regex = /^\S+\s+|\s*\S+\s*\S+$|\s*\S+/g;
	const boundaries = [];
	let match;

	while ((match = regex.exec(header))) {
		boundaries.push(match[0].length);
	}

	// Extend last column boundary
	boundaries[boundaries.length - 1] = -1;

	return boundaries;
};

const parseOutput = async output => {
	const lines = output.trim().split('\n');
	const boundaries = await getColumnBoundaries(lines[0]);

	return lines.slice(1).map(line => {
		const cl = boundaries.map(boundary => {
			// Handle extra-long last column
			const column = boundary > 0 ? line.slice(0, boundary) : line;
			line = line.slice(boundary);
			return column.trim();
		});

		return {
			filesystem: cl[0],
			size: parseInt(cl[1], 10) * 1024,
			used: parseInt(cl[2], 10) * 1024,
			available: parseInt(cl[3], 10) * 1024,
			capacity: parseInt(cl[4], 10) / 100,
			mountpoint: cl[5]
		};
	});
};

const run = async args => {
	const {stdout} = await execa('df', args);
	return parseOutput(stdout);
};

const df = async () => run(['-kP']);

df.fs = async name => {
	if (typeof name !== 'string') {
		throw new TypeError('The `name` parameter required');
	}

	const data = await run(['-kP']);

	for (const item of data) {
		if (item.filesystem === name) {
			return item;
		}
	}

	throw new Error(`The specified filesystem \`${name}\` doesn't exist`);
};

df.file = async file => {
	if (typeof file !== 'string') {
		throw new TypeError('The `file` parameter is required');
	}

	let data;
	try {
		data = await run(['-kP', file]);
	} catch (error) {
		if (/No such file or directory/.test(error.stderr)) {
			throw new Error(`The specified file \`${file}\` doesn't exist`);
		}

		throw error;
	}

	return data[0];
};

module.exports = df;
// TODO: remove this in the next major version
module.exports.default = df;

if (process.env.NODE_ENV === 'test') {
	module.exports._parseOutput = parseOutput;
}
