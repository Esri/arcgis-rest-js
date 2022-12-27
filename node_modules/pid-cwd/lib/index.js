const os = process.platform;

const cwdProvider =
    /darwin/.test(os) ? require('./macos') :
    /win32/.test(os) ? require('./win') :
    /linux/.test(os) ? require('./linux') : null;

if (!cwdProvider) {
    throw new Error(`pid-cwd: Unknown platform "${os}". To import manually use require('pid-cwd/lib/xyz') where xyz is linux, macos or win`)
}

module.exports = cwdProvider;