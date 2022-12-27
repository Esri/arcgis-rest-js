const exec = require('child_process').exec;
const path = require('path');

function cwd(pid) {
    if (typeof pid !== 'number' || pid < 0) {
        throw new TypeError(`pid must be a positive number`);
    }
    return new Promise((resolve) => {
        exec(`${path.join(__dirname, 'win_pwdx/Release/win_pwdx.exe')} ${pid}`, {
            shell: 'cmd.exe'
        }, (err, stdout) => {
            resolve(err ? null : stdout);
        })
    });
}

module.exports = cwd;