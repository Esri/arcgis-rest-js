var glob = require("glob");
var path = require("path");

glob("./src/**/*.ts", function (err, files) {
    if (files) {
        for (indx in files) {
            const file = files[indx];
            console.log(file);
            const exec = require( 'child_process' ).exec;
            // "tsc ./src/*.ts --moduleResolution node --importHelpers --module es2015 --outDir ./dist/esm --sourceMap --declaration --target ES5"
            const ls = exec('tsc "' + file + '" --moduleResolution node --importHelpers --module es2015 --outDir "' + path.join(".","dist", "esm") + '" --sourceMap --declaration --target ES5');

            ls.stdout.on( 'data', data => {
                console.log( `stdout: ${data}` );
            });

            ls.stderr.on( 'data', data => {
                console.log( `stderr: ${data}` );
            });

            ls.on( 'close', code => {
                console.log( `child process exited with code ${code}` );
            });
        }
    }
});