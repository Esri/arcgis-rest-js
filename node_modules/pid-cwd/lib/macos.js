const exec = require('child_process').exec;

function cwd(pid) {
    if (typeof pid !== 'number' || pid < 0) {
        throw new TypeError(`pid must be a positive number`);
    }
    return new Promise((resolve) => {
        exec(`LANG=en_US.utf-8 lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`, (err, stdout) => {
            resolve(err ? null : stdout.trim());
        })
    });
}

module.exports = cwd;