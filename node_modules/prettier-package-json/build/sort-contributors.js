"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var parse_author_1 = __importDefault(require("parse-author"));
var sort_object_keys_1 = __importDefault(require("sort-object-keys"));
var sort_order_1 = __importDefault(require("sort-order"));
// Sort by a field in an object
var field = function (name) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var _a = args.map(function (obj) { return obj[name]; }), a = _a[0], b = _a[1];
    if (a !== b) {
        return a < b ? -1 : 1;
    }
    else {
        return 0;
    }
}; };
function sortContributors(key, packageJson, opts) {
    var _a, _b;
    if (opts === void 0) { opts = {}; }
    var sortByName = field('name');
    var sortByEmail = field('email');
    var contributors = hydrate(packageJson[key])
        .map(function (user) { return sort_object_keys_1["default"](user, ['name', 'email', 'url']); })
        .sort(sort_order_1["default"](sortByName, sortByEmail));
    switch (contributors.length) {
        case 0:
            return {};
        case 1:
            if (!opts.enforceMultiple) {
                return _a = {}, _a[key] = opts.expandUsers ? contributors[0] : stringify(contributors[0]), _a;
            }
        default:
            return _b = {}, _b[key] = opts.expandUsers ? contributors : contributors.map(stringify), _b;
    }
}
exports["default"] = sortContributors;
function hydrate(input) {
    if (!input) {
        return [];
    }
    else if (Array.isArray(input)) {
        return input.reduce(function (state, item) { return __spreadArray(__spreadArray([], state), hydrate(item)); }, []);
    }
    else if (typeof input === 'object') {
        return [input];
    }
    else if (typeof input === 'string') {
        return [parse_author_1["default"](input)];
    }
    else {
        return [];
    }
}
function stringify(user) {
    var name = user.name;
    var email = user.email ? "<" + user.email + ">" : undefined;
    var url = user.url ? "(" + user.url + ")" : undefined;
    return [name, email, url].filter(Boolean).join(' ');
}
