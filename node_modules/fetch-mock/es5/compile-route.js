'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _glob = require('glob-to-regexp');
var _express = require('path-to-regexp');

var stringMatchers = {
	begin: function begin(targetString) {
		return function (url) {
			return url.indexOf(targetString) === 0;
		};
	},
	end: function end(targetString) {
		return function (url) {
			return url.substr(-targetString.length) === targetString;
		};
	},
	glob: function glob(targetString) {
		var urlRX = _glob(targetString.replace(/^glob:/, ''));
		return function (url) {
			return urlRX.test(url);
		};
	},
	express: function express(targetString) {
		var urlRX = _express(targetString.replace(/^express:/, ''));
		return function (url) {
			return urlRX.test(url);
		};
	}
};

function getHeaderMatcher(expectedHeaders, HeadersConstructor) {
	var expectation = Object.keys(expectedHeaders).map(function (k) {
		return { key: k.toLowerCase(), val: expectedHeaders[k] };
	});
	return function (headers) {
		if (!headers) {
			headers = {};
		}

		if (headers instanceof HeadersConstructor) {
			headers = headers.raw();
		}

		var lowerCaseHeaders = Object.keys(headers).reduce(function (obj, k) {
			obj[k.toLowerCase()] = headers[k];
			return obj;
		}, {});

		return expectation.every(function (header) {
			return areHeadersEqual(lowerCaseHeaders, header);
		});
	};
}

function areHeadersEqual(currentHeader, expectedHeader) {
	var key = expectedHeader.key;
	var val = expectedHeader.val;
	var currentHeaderValue = Array.isArray(currentHeader[key]) ? currentHeader[key] : [currentHeader[key]];
	var expectedHeaderValue = Array.isArray(val) ? val : [val];

	if (currentHeaderValue.length !== expectedHeaderValue.length) {
		return false;
	}

	for (var i = 0; i < currentHeaderValue.length; ++i) {
		if (currentHeaderValue[i] !== expectedHeaderValue[i]) {
			return false;
		}
	}

	return true;
}

function normalizeRequest(url, options, Request) {
	if (Request.prototype.isPrototypeOf(url)) {
		return {
			url: url.url,
			method: url.method,
			headers: function () {
				var headers = {};
				url.headers.forEach(function (name) {
					return headers[name] = url.headers.name;
				});
				return headers;
			}()
		};
	} else {
		return {
			url: url,
			method: options && options.method || 'GET',
			headers: options && options.headers
		};
	}
}

module.exports = function (route, Request, HeadersConstructor) {
	route = _extends({}, route);

	if (typeof route.response === 'undefined') {
		throw new Error('Each route must define a response');
	}

	if (!route.matcher) {
		throw new Error('each route must specify a string, regex or function to match calls to fetch');
	}

	if (!route.name) {
		route.name = route.matcher.toString();
		route.__unnamed = true;
	}

	var matchUrl = void 0;

	var expectedMethod = route.method && route.method.toLowerCase();

	function matchMethod(method) {
		return !expectedMethod || expectedMethod === (method ? method.toLowerCase() : 'get');
	};

	var matchHeaders = route.headers ? getHeaderMatcher(route.headers, HeadersConstructor) : function () {
		return true;
	};

	if (typeof route.matcher === 'function') {
		matchUrl = route.matcher;
	} else if (typeof route.matcher === 'string') {

		Object.keys(stringMatchers).some(function (name) {
			if (route.matcher.indexOf(name + ':') === 0) {
				var url = route.matcher.replace(new RegExp('^' + name + ':'), '');
				matchUrl = stringMatchers[name](url);
				return true;
			}
		});
		if (!matchUrl) {
			if (route.matcher === '*') {
				matchUrl = function matchUrl() {
					return true;
				};
			} else if (route.matcher.indexOf('^') === 0) {
				(function () {
					console.warn('Using \'^\' to denote the start of a url is deprecated. Use \'begin:\' instead');
					var expectedUrl = route.matcher.substr(1);
					matchUrl = function matchUrl(url) {
						return url.indexOf(expectedUrl) === 0;
					};
				})();
			} else {
				(function () {
					var expectedUrl = route.matcher;
					matchUrl = function matchUrl(url) {
						return url === expectedUrl;
					};
				})();
			}
		}
	} else if (route.matcher instanceof RegExp) {
		(function () {
			var urlRX = route.matcher;
			matchUrl = function matchUrl(url) {
				return urlRX.test(url);
			};
		})();
	}

	var matcher = function matcher(url, options) {
		var req = normalizeRequest(url, options, Request);
		return matchHeaders(req.headers) && matchMethod(req.method) && matchUrl(req.url, options);
	};

	if (route.times) {
		(function () {
			var timesLeft = route.times;
			route.matcher = function (url, options) {
				var match = timesLeft && matcher(url, options);
				if (match) {
					timesLeft--;
					return true;
				}
			};
			route.reset = function () {
				return timesLeft = route.times;
			};
		})();
	} else {
		route.matcher = matcher;
	}

	return route;
};