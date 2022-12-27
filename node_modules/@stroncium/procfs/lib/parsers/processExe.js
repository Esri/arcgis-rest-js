const EXE_DELETED_FLAG = '(deleted)';
module.exports = src => {
	let deleted = src.endsWith(EXE_DELETED_FLAG);
	if (deleted) {
		src = src.substr(0, src.length - EXE_DELETED_FLAG.length).trim();
	}
	return {path: src, deleted};
};
