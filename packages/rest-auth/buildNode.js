var glob = require("glob");
var path = require("path");

glob("./src/**/*.ts", function (err, files) {
    if (files) {
        for (indx in files) {
            const file = files[indx];
            console.log(file);
            const exec = require( 'child_process' ).exec;
            // "tsc ./src/*.ts --importHelpers --module commonjs --outDir ./dist/node --sourceMap --target ES5"
            const ls = exec('tsc "' + file + '" --importHelpers --module commonjs --outDir "' + path.join(".","dist", "node") + '" --sourceMap --target ES5');

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