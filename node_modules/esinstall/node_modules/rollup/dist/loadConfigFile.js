/*
  @license
	Rollup.js v2.37.1
	Wed, 20 Jan 2021 11:53:42 GMT - commit e23bb354cca08dbe32e3f6a3ba5c63d015e91ff9


	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

var loadConfigFile_js = require('./shared/loadConfigFile.js');
require('fs');
require('path');
require('url');
require('./shared/rollup.js');
require('./shared/mergeOptions.js');
require('crypto');
require('events');



module.exports = loadConfigFile_js.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
