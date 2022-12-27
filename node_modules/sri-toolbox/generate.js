/*
    sri-toolbox-generate
*/

/*jslint node:true regexp:true */
"use strict";

var crypto = require("crypto"),
    url = require("url"),

    defaults = function (options) {
        return {
            algorithms: options.algorithms || ["sha256"],
            delimiter: options.delimiter || " ",
            full: options.full || false
        };
    },


/*
    Functionality
*/

    // Generate hash
    digest = function (algorithm, data) {
        return crypto
            .createHash(algorithm)
            .update(data, 'utf8')
            .digest("base64");
    },

    // Generate list of hashes
    hashes = function (options, data) {
        var hashes = {};
        options.algorithms.forEach(function (algorithm) {
            hashes[algorithm] = digest(algorithm, data);
        });
        return hashes;
    },

    // Build an integrity string
    integrity = function (options, sri) {
        var output = "";

        // Hash list
        output += Object.keys(sri.hashes).map(function (algorithm) {
            return algorithm + "-" + sri.hashes[algorithm];
        }).join(options.delimiter);

        return output;
    },

    main = function (options, data) {
        // Defaults
        options = defaults(options);

        var sri = {
            hashes: hashes(options, data),
            integrity: undefined
        };
        sri.integrity = integrity(options, sri);

        return (options.full) ? sri : sri.integrity;
    };


/*
    Exports
*/

module.exports = main;
