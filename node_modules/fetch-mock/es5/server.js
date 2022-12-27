'use strict';

var fetch = require('node-fetch');
var Request = fetch.Request;
var Response = fetch.Response;
var Headers = fetch.Headers;
var stream = require('stream');
var FetchMock = require('./fetch-mock');
var http = require('http');

FetchMock.global = global;
FetchMock.statusTextMap = http.STATUS_CODES;
FetchMock.stream = stream;

FetchMock.setImplementations({
	Promise: Promise,
	Request: Request,
	Response: Response,
	Headers: Headers
});

module.exports = new FetchMock();