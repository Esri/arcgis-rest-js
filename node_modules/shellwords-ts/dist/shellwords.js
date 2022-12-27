"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
function scan(line, pattern, callback) {
    var result = "";
    var match;
    while (!!line.length) {
        match = line.match(pattern);
        if (match) {
            result += line.slice(0, match.index);
            result += callback(match);
            line = line.slice(match.index + match[0].length);
        }
        else {
            result += line;
            line = "";
        }
    }
    return result;
}
function rgx(tmplObj) {
    var subst = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        subst[_i - 1] = arguments[_i];
    }
    var regexText = tmplObj.raw[0];
    var wsrgx = /^\s+|\s+\n|\s*#[\s\S]*?\n|\n/gm;
    var txt2 = regexText.replace(wsrgx, '');
    return new RegExp(txt2, "m");
}
var SHELL_PARSE_REGEX = rgx(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\ns*                     # Leading whitespace\n(?=(                      # Mimic \"(?>)\" -> http://blog.stevenlevithan.com/archives/mimic-atomic-groups\n  ([^s\\'\"]+)          # Normal words\n  |                       #\n  '([^']*)'              # Stuff in single quotes\n  |                       #\n  \"((?:[^\"\\]|\\.)*)\"    # Stuff in double quotes\n  |                       #\n  (\\.?)                  # Escaped character\n  |                       #\n  (S)                    # Garbage\n))1                      #\n(s|$)?                 # Seperator\n"], ["\n\\s*                     # Leading whitespace\n(?=(                      # Mimic \"(?>)\" -> http://blog.stevenlevithan.com/archives/mimic-atomic-groups\n  ([^\\s\\\\\\'\\\"]+)          # Normal words\n  |                       #\n  '([^\\']*)'              # Stuff in single quotes\n  |                       #\n  \"((?:[^\\\"\\\\]|\\\\.)*)\"    # Stuff in double quotes\n  |                       #\n  (\\\\.?)                  # Escaped character\n  |                       #\n  (\\S)                    # Garbage\n))\\1                      #\n(\\s|$)?                 # Seperator\n"])));
function split(line, callback) {
    var words = [];
    var field = "";
    var rawParsed = "";
    scan(line, SHELL_PARSE_REGEX, function (match) {
        var raw = match[0], word = match[2], sq = match[3], dq = match[4], esc = match[5], garbage = match[6], separator = match[7];
        if ("string" === typeof garbage) {
            throw new Error("Unmatched quote");
        }
        rawParsed += raw;
        field += (word || sq || (dq && dq.replace(/\\([$`"\\\n])/g, "$1")) || (esc || "").replace(/\\(.)/g, "$1"));
        if ("string" === typeof separator || "" === sq || "" === dq) {
            words.push(field);
            if ("function" === typeof callback) {
                callback(rawParsed);
            }
            rawParsed = "";
            return field = "";
        }
    });
    if (field) {
        words.push(field);
        if ("function" === typeof callback) {
            callback(rawParsed);
        }
    }
    return words;
}
exports.split = split;
function escape(raw) {
    if (!raw) {
        return "''";
    }
    return raw.replace(/[^A-Za-z0-9_\-.,:+\/@\n]/g, "\\$&").replace(/\n/g, "'\n'");
}
exports.escape = escape;
function join(strings) {
    var results = [];
    for (var _i = 0, strings_1 = strings; _i < strings_1.length; _i++) {
        var s = strings_1[_i];
        results.push(escape(s));
    }
    return results.join(" ");
}
exports.join = join;
var Shellwords = (function () {
    function Shellwords() {
        this.split = split;
        this.escape = escape;
        this.join = join;
    }
    return Shellwords;
}());
exports.default = new Shellwords();
var templateObject_1;
//# sourceMappingURL=shellwords.js.map