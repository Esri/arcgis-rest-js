"use strict";

var assert = require("assert"),
    sriToolbox = require("../main"),
    fs = require("fs"),

//    testString = "",
    sourceCode = fs.readFileSync("./test/jquery-1.10.2.min.js.testdata", { encoding: "ascii" });


describe("Generate:", function () {

    it("Default", function () {
        var options = {};
        var expect = "sha256-C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg=";
        var result = sriToolbox.generate(options, sourceCode);
        assert.equal(expect, result);
    });

    it("Unicode chars", function () {
        var options = {};
        var unicodeSourceCode = "console.log('I ♡ WebAppSec!');\n";
        var expect = "sha256-TH5eRuwfOSKZE0EKVF4WZ6gVQ/zUch4CZE2knqpS4MU=";
        var result = sriToolbox.generate(options, unicodeSourceCode);
        assert.equal(expect, result);
    });

    it("Custom", function () {
        var options = {
            algorithms: ["sha512"],
            delimiter: "  "
        };
        var expect = "sha512-OqaFaP8lkurUEqDH9cOavDesVi8At8Fq8HzV7/iBqtznfscQQLNsCtnC0qpO3XdE+nKw9Ey4tIXU8oOxtJwhQQ==";
        var result = sriToolbox.generate(options, sourceCode);
        assert.equal(expect, result);
    });

    it("Object", function () {
        var options = {
            full: true
        };
        var expect = {
            hashes: {
                sha256: "C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg="
            },
            integrity: "sha256-C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg="
        };
        var result = sriToolbox.generate(options, sourceCode);
        assert.deepEqual(expect, result);
    });

});
