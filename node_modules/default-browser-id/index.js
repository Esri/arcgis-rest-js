'use strict';
const os = require('os');
const bplist = require('bplist-parser');
const untildify = require('untildify');
const pify = require('pify');
const osxVersion = Number(os.release().split('.')[0]);
const file = untildify(osxVersion >= 14 ? '~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist' : '~/Library/Preferences/com.apple.LaunchServices.plist');

module.exports = () => {
	if (process.platform !== 'darwin') {
		return Promise.reject(new Error('Only OS X is supported'));
	}

	let bundleId = 'com.apple.Safari';

	return pify(bplist.parseFile)(file).then(data => {
		const handlers = data && data[0].LSHandlers;

		if (!handlers || handlers.length === 0) {
			return bundleId;
		}

		for (const el of handlers) {
			if (el.LSHandlerURLScheme === 'http' && el.LSHandlerRoleAll) {
				bundleId = el.LSHandlerRoleAll;
				break;
			}
		}

		return bundleId;
	});
};
