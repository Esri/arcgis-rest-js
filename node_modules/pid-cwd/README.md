# pid-cwd

Node lib to get the current working directory of given process id - cross platform*
 
## Usage

### Install

```bash
$ npm i pid-cwd
```

### Use

```javascript
const pidCwd = require('pid-cwd');

pidCwd(54671)
    .then(cwd => {
        // A check is recommended, cwd could be null sometimes (read note below)
        console.log(cwd); // > /home/chipto/Dropbox
    });

```

## Note

`pid-cwd` will simply return `null` if process doesn't exist, or process is owned by root/administrator or is unreachable or any other reason.<br>
It won't throw any `EPERM` error or anything like that. It does throw if it can't recognize the OS or given `pid` is not a positive number.

\* Works as long as `process.platform` === `win32`, `linux` or `darwin`. <br>
&nbsp;&nbsp;&nbsp;Throws if it's not one of those, in that case `require` manually from `pid-cwd/lib/$1` where `$1` is `win`, `linux` or `macos`

## External Licenses

Massive thanks to  Giampaolo Rodola' and contributors, for their amazing work on [psutil](https://github.com/giampaolo/psutil)

`lib/win_pwdx/` contains 99.97% of code borrowed from [`psutil/arch/windows/process_info.c`](https://github.com/giampaolo/psutil/blob/master/psutil/arch/windows/process_info.c)

`psutil` is BSD licensed, see [`psutil/LICENSE`](https://github.com/giampaolo/psutil/blob/master/LICENSE) for more information.
