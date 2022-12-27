'use strict'

var fs = require('fs')
var path = require('path')
var isWsl = require('is-wsl')
var which = require('which')
var { execSync } = require('child_process')
var { StringDecoder } = require('string_decoder')

var PREFS = [
  'user_pref("browser.shell.checkDefaultBrowser", false);',
  'user_pref("browser.bookmarks.restore_default_bookmarks", false);',
  'user_pref("dom.disable_open_during_load", false);',
  'user_pref("dom.max_script_run_time", 0);',
  'user_pref("dom.min_background_timeout_value", 10);',
  'user_pref("extensions.autoDisableScopes", 0);',
  'user_pref("browser.tabs.remote.autostart", false);',
  'user_pref("browser.tabs.remote.autostart.2", false);',
  'user_pref("extensions.enabledScopes", 15);'
].join('\n')

// Check if Firefox is installed on the WSL side and use that if it's available
if (isWsl && which.sync('firefox', { nothrow: true })) {
  isWsl = false
}

// Get all possible Program Files folders even on other drives
// inspect the user's path to find other drives that may contain Program Files folders
var getAllPrefixes = function () {
  var drives = []
  var paden = process.env.Path.split(';')
  var re = /^[A-Z]:\\/i
  var pad
  for (var p = 0; p < paden.length; p++) {
    pad = paden[p]
    if (re.test(pad) && drives.indexOf(pad[0]) === -1) {
      drives.push(pad[0])
    }
  }

  var result = []
  var prefixes = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']]
  var prefix
  for (var i = 0; i < prefixes.length; i++) {
    if (typeof prefixes[i] !== 'undefined') {
      for (var d = 0; d < drives.length; d += 1) {
        prefix = drives[d] + prefixes[i].substr(1)
        if (result.indexOf(prefix) === -1) {
          result.push(prefix)
        }
      }
    }
  }
  return result
}

// Return location of firefox.exe file for a given Firefox directory
// (available: "Mozilla Firefox", "Aurora", "Nightly").
var getFirefoxExe = function (firefoxDirName) {
  if (process.platform !== 'win32' && process.platform !== 'win64') {
    return null
  }

  var firefoxDirNames = Array.prototype.slice.call(arguments)

  for (var prefix of getAllPrefixes()) {
    for (var dir of firefoxDirNames) {
      var candidate = path.join(prefix, dir, 'firefox.exe')
      if (fs.existsSync(candidate)) {
        return candidate
      }
    }
  }

  return path.join('C:\\Program Files', firefoxDirNames[0], 'firefox.exe')
}

var getAllPrefixesWsl = function () {
  var drives = []
  // Some folks configure their wsl.conf to mount Windows drives without the
  // /mnt prefix (e.g. see https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly)
  //
  // In fact, they could configure this to be any number of things. So we
  // take each path, convert it to a Windows path, check if it looks like
  // it starts with a drive and then record that.
  var re = /^([A-Z]):\\/i
  for (var pathElem of process.env.PATH.split(':')) {
    if (fs.existsSync(pathElem)) {
      var windowsPath = execSync('wslpath -w "' + pathElem + '"').toString()
      var matches = windowsPath.match(re)
      if (matches !== null && drives.indexOf(matches[1]) === -1) {
        drives.push(matches[1])
      }
    }
  }

  var result = []
  // We don't have the PROGRAMFILES or PROGRAMFILES(X86) environment variables
  // in WSL so we just hard code them.
  var prefixes = ['Program Files', 'Program Files (x86)']
  for (var prefix of prefixes) {
    for (var drive of drives) {
      // We only have the drive, and only wslpath knows exactly what they map to
      // in Linux, so we convert it back here.
      var wslPath =
        execSync('wslpath "' + drive + ':\\' + prefix + '"').toString().trim()
      result.push(wslPath)
    }
  }

  return result
}

var getFirefoxExeWsl = function (firefoxDirName) {
  if (!isWsl) {
    return null
  }

  var firefoxDirNames = Array.prototype.slice.call(arguments)

  for (var prefix of getAllPrefixesWsl()) {
    for (var dir of firefoxDirNames) {
      var candidate = path.join(prefix, dir, 'firefox.exe')
      if (fs.existsSync(candidate)) {
        return candidate
      }
    }
  }

  return path.join('/mnt/c/Program Files/', firefoxDirNames[0], 'firefox.exe')
}

var getFirefoxWithFallbackOnOSX = function () {
  if (process.platform !== 'darwin') {
    return null
  }

  var firefoxDirNames = Array.prototype.slice.call(arguments)
  var prefix = '/Applications/'
  var suffix = '.app/Contents/MacOS/firefox-bin'

  var bin
  var homeBin
  for (var i = 0; i < firefoxDirNames.length; i++) {
    bin = prefix + firefoxDirNames[i] + suffix

    if ('HOME' in process.env) {
      homeBin = path.join(process.env.HOME, bin)

      if (fs.existsSync(homeBin)) {
        return homeBin
      }
    }

    if (fs.existsSync(bin)) {
      return bin
    }
  }
}

var makeHeadlessVersion = function (Browser) {
  var HeadlessBrowser = function () {
    Browser.apply(this, arguments)
    var execCommand = this._execCommand
    this._execCommand = function (command, args) {
      // --start-debugger-server ws:6000 can also be used, since remote debugging protocol also speaks WebSockets
      // https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/
      execCommand.call(this, command, args.concat(['-headless', '--start-debugger-server 6000']))
    }
  }

  HeadlessBrowser.prototype = Object.create(Browser.prototype, {
    name: { value: Browser.prototype.name + 'Headless' }
  })
  HeadlessBrowser.$inject = Browser.$inject
  return HeadlessBrowser
}

// https://developer.mozilla.org/en-US/docs/Command_Line_Options
var FirefoxBrowser = function (id, baseBrowserDecorator, args) {
  baseBrowserDecorator(this)

  var browserProcessPid

  this._getPrefs = function (prefs) {
    if (typeof prefs !== 'object') {
      return PREFS
    }
    var result = PREFS
    for (var key in prefs) {
      result += 'user_pref("' + key + '", ' + JSON.stringify(prefs[key]) + ');\n'
    }
    return result
  }

  this._start = function (url) {
    var self = this
    var command = args.command || this._getCommand()
    var profilePath = args.profile || self._tempDir
    var flags = args.flags || []
    var extensionsDir

    if (Array.isArray(args.extensions)) {
      extensionsDir = path.resolve(profilePath, 'extensions')
      fs.mkdirSync(extensionsDir)
      args.extensions.forEach(function (ext) {
        var extBuffer = fs.readFileSync(ext)
        var copyDestination = path.resolve(extensionsDir, path.basename(ext))
        fs.writeFileSync(copyDestination, extBuffer)
      })
    }

    fs.writeFileSync(path.join(profilePath, 'prefs.js'), this._getPrefs(args.prefs))
    var translatedProfilePath =
      isWsl ? execSync('wslpath -w ' + profilePath).toString().trim() : profilePath

    // If we are using the launcher process, make it print the child process ID
    // to stderr so we can capture it.
    //
    // https://wiki.mozilla.org/Platform/Integration/InjectEject/Launcher_Process/
    process.env.MOZ_DEBUG_BROWSER_PAUSE = 0
    browserProcessPid = undefined
    self._execCommand(
      command,
      [url, '-profile', translatedProfilePath, '-no-remote', '-wait-for-browser'].concat(flags)
    )

    self._process.stderr.on('data', errBuff => {
      var errString
      if (typeof errBuff === 'string') {
        errString = errBuff
      } else {
        var decoder = new StringDecoder('utf8')
        errString = decoder.write(errBuff)
      }
      var matches = errString.match(/BROWSERBROWSERBROWSERBROWSER\s+debug me @ (\d+)/)
      if (matches) {
        browserProcessPid = parseInt(matches[1], 10)
      }
    })
  }

  this.on('kill', function (done) {
    // If we have a separate browser process PID, try killing it.
    if (browserProcessPid) {
      try {
        process.kill(browserProcessPid)
      } catch (e) {
        // Ignore failure -- the browser process might have already been
        // terminated.
      }
    }

    return process.nextTick(done)
  })
}

FirefoxBrowser.prototype = {
  name: 'Firefox',

  DEFAULT_CMD: {
    linux: isWsl ? getFirefoxExeWsl('Mozilla Firefox') : 'firefox',
    freebsd: 'firefox',
    darwin: getFirefoxWithFallbackOnOSX('Firefox'),
    win32: getFirefoxExe('Mozilla Firefox')
  },
  ENV_CMD: 'FIREFOX_BIN'
}

FirefoxBrowser.$inject = ['id', 'baseBrowserDecorator', 'args']

var FirefoxHeadlessBrowser = makeHeadlessVersion(FirefoxBrowser)

var FirefoxDeveloperBrowser = function () {
  FirefoxBrowser.apply(this, arguments)
}

FirefoxDeveloperBrowser.prototype = {
  name: 'FirefoxDeveloper',
  DEFAULT_CMD: {
    linux: isWsl ? getFirefoxExeWsl('Firefox Developer Edition') : 'firefox',
    darwin: getFirefoxWithFallbackOnOSX('Firefox Developer Edition', 'FirefoxDeveloperEdition', 'FirefoxAurora'),
    win32: getFirefoxExe('Firefox Developer Edition')
  },
  ENV_CMD: 'FIREFOX_DEVELOPER_BIN'
}

FirefoxDeveloperBrowser.$inject = ['id', 'baseBrowserDecorator', 'args']

var FirefoxDeveloperHeadlessBrowser = makeHeadlessVersion(FirefoxDeveloperBrowser)

var FirefoxAuroraBrowser = function () {
  FirefoxBrowser.apply(this, arguments)
}

FirefoxAuroraBrowser.prototype = {
  name: 'FirefoxAurora',
  DEFAULT_CMD: {
    linux: isWsl ? getFirefoxExeWsl('Aurora') : 'firefox',
    darwin: getFirefoxWithFallbackOnOSX('FirefoxAurora'),
    win32: getFirefoxExe('Aurora')
  },
  ENV_CMD: 'FIREFOX_AURORA_BIN'
}

FirefoxAuroraBrowser.$inject = ['id', 'baseBrowserDecorator', 'args']

var FirefoxAuroraHeadlessBrowser = makeHeadlessVersion(FirefoxAuroraBrowser)

var FirefoxNightlyBrowser = function () {
  FirefoxBrowser.apply(this, arguments)
}

FirefoxNightlyBrowser.prototype = {
  name: 'FirefoxNightly',

  DEFAULT_CMD: {
    linux: isWsl ? getFirefoxExeWsl('Nightly', 'Firefox Nightly') : 'firefox',
    darwin: getFirefoxWithFallbackOnOSX('FirefoxNightly', 'Firefox Nightly'),
    win32: getFirefoxExe('Nightly', 'Firefox Nightly')
  },
  ENV_CMD: 'FIREFOX_NIGHTLY_BIN'
}

FirefoxNightlyBrowser.$inject = ['id', 'baseBrowserDecorator', 'args']

var FirefoxNightlyHeadlessBrowser = makeHeadlessVersion(FirefoxNightlyBrowser)

// PUBLISH DI MODULE
module.exports = {
  'launcher:Firefox': ['type', FirefoxBrowser],
  'launcher:FirefoxHeadless': ['type', FirefoxHeadlessBrowser],
  'launcher:FirefoxDeveloper': ['type', FirefoxDeveloperBrowser],
  'launcher:FirefoxDeveloperHeadless': ['type', FirefoxDeveloperHeadlessBrowser],
  'launcher:FirefoxAurora': ['type', FirefoxAuroraBrowser],
  'launcher:FirefoxAuroraHeadless': ['type', FirefoxAuroraHeadlessBrowser],
  'launcher:FirefoxNightly': ['type', FirefoxNightlyBrowser],
  'launcher:FirefoxNightlyHeadless': ['type', FirefoxNightlyHeadlessBrowser]
}
