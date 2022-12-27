const fs = require('fs')
const path = require('path')
const {
    loadWASM,
    OnigScanner,
    OnigString
} = require('.');

const wasmBin = fs.readFileSync(path.join(__dirname, './lib/onigasm.wasm')).buffer

const StopWatch = typeof performance === 'undefined' ? Date : performance
const log = console.log

loadWASM(wasmBin).then(() => {
    const str = fs.readFileSync('node_modules/typescript/lib/typescriptServices.js', 'utf8').repeat(2)
    const scanner = new OnigScanner(['searchTillTheEndButYouWontFindMe'])
    var T0 = StopWatch.now()

    log()
    const test = (charCount) => {
        let t0 = StopWatch.now()
        let stepCount = 50
        let stepFactor = charCount / 5
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < stepCount; j++) {
                scanner.findNextMatchSync(str.slice(0, j * stepFactor))
            }
        }
        log(`Uncached strings < ${charCount} characters\n:`, StopWatch.now() - t0, 'ms')
    
        t0 = StopWatch.now()
        var onig_strs = Array(stepCount).fill(undefined).map((_, i) => new OnigString(str.slice(0, stepFactor * i)))
        for (let i = 0; i < 100; i++) {
            for(let j = 0; j < stepCount; j++) {
                scanner.findNextMatchSync(onig_strs[j])
            }
        }
        log(`Cached strings < ${charCount} characters\n:`, StopWatch.now() - t0, 'ms')
        log()
    }

    [
        100,
        1000,
        10000,
        50000,
        100000,
        1000000,
        2000000,
    ].forEach(test)



    console.log('All tests took ', StopWatch.now() - T0, 'ms')
})
.catch(console.log)