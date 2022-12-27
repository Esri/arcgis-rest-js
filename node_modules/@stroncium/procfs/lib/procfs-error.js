class ProcfsError extends Error {
	constructor(code, message, sourceError) {
		super(message);
		this.name = 'ProcfsError';
		this.code = code;
		if (sourceError !== undefined) {
			this.sourceError = sourceError;
		}
	}
}

ProcfsError.ERR_PARSING_FAILED = 'EPARSE';
ProcfsError.ERR_UNKNOWN = 'EUNKNOWN';
ProcfsError.ERR_NOT_FOUND = 'ENOENT';

ProcfsError.parsingError = (src, msg) => {
	let e = new ProcfsError(ProcfsError.ERR_PARSING_FAILED, `Parsing failed: ${msg}`);
	e.sourceText = src;
	return e;
};

ProcfsError.generic = err => {
	/* istanbul ignore next should not ever happen */
	if (err instanceof ProcfsError) {
		return err;
	}

	switch (err.code) {
		case 'ENOENT':
			return new ProcfsError(ProcfsError.ERR_NOT_FOUND, 'File not found', err);
		/* istanbul ignore next should not ever happen*/
		default:
			return new ProcfsError(ProcfsError.ERR_UNKNOWN, `Unknown error: ${err.message}`, err);
	}
};

module.exports = ProcfsError;
