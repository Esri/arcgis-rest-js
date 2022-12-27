const {gunzipSync} = require('zlib');

module.exports = src => gunzipSync(src).toString('utf8');
