# multi-semantic-release

[![Travis CI](https://travis-ci.com/dhoulb/multi-semantic-release.svg?branch=master)](https://travis-ci.com/dhoulb/multi-semantic-release)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/dm/multi-semantic-release.svg)](https://www.npmjs.com/package/multi-semantic-release)

Hacky semantic-release for monorepos

## Overview
Proof of concept that wraps [semantic-release](https://github.com/semantic-release/semantic-release) 
to work with [monorepos](https://en.wikipedia.org/wiki/Monorepo).

This package should work well, but **may not be fundamentally stable enough** for important production use as 
it's pretty dependent on how semantic-release works (so it may break or get out-of-date in future versions 
of semantic-release).

One of the best things about semantic-release is forgetting about version numbers. In a monorepo though there's still 
a lot of version number management required for local deps (packages in the same monorepo referenced in `dependencies` 
or `devDependencies` or `peerDependencies`). However in multi-semantic-release the version numbers of local deps are 
written into `package.json` at release time. This means there's no need to hard-code versions any more 
(we recommend just using `*` asterisk instead in your repo code).

### Key features
- CLI & JS API
- Automated & configurable cross-pkg version bumping
- Provides alpha & beta-branched release flow
- Supports npm (v7+), yarn, pnpm (with limitations), bolt-based monorepos
- Optional packages ignoring
- Linux/MacOs/Windows support

### Table of contents
- [Installation](#installation)
- [Requirements](#requirements)
- [Usage](#usage)
- [Configuration](#configuration)
  - [yarn/npm](#yarn--npm-v7)
  - [pnpm](#pnpm)
  - [bolt](#bolt)
- [CLI](#cli)
- [API](#api)
- [CI/CD](#cicd)
- [⚠️Troubleshooting](#troubleshooting)
- [Implementation notes](#implementation-notes-and-other-thoughts)
  - [Support for monorepos](#support-for-monorepos)
  - [Iteration vs coordination](#iteration-vs-coordination)
  - [Local deps and versioning](#local-dependencies-and-version-numbers)
  - [Integration with semantic-release](#integration-with-semantic-release)
  - [Git tags](#git-tags)
- [Contributing](#contributing)
- [Alternatives](#alternatives)
- [License](#license)

## Installation

```sh
yarn add multi-semantic-release --dev
npm i multi-semantic-release -D
```

## Requirements
* Node.js >= 10
* [git-notes enabled](https://github.com/semantic-release/semantic-release/blob/2e4b901c4f412980a425469fae49cfaef500d47a/docs/support/troubleshooting.md#release-not-found-release-branch-after-git-push---force)

## Usage

```sh
multi-semantic-release [options]
npx multi-semantic-release [options]
```

## Configuration

Configuration for releases is the same as [semantic-release configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md), i.e. using a `release` key under `package.json` or in `.releaserc` file of any type e.g. `.yaml`, `.json`.

_But_ in multi-semantic-release this configuration can be done globally (in your top-level dir), or per-package (in that individual package's dir). If you set both then per-package settings will override global settings.

multi-semantic-release does not support any command line arguments (this wasn't possible without duplicating files from semantic-release, which I've tried to avoid).

multi-semantic-release automatically detects packages within workspaces for the following package-managers:

### yarn / npm (v7+)

Make sure to have a `workspaces` attribute inside your `package.json` project file. In there, you can set a list of packages that you might want to process in the msr process, as well as ignore others. For example, let's say your project has 4 packages (i.e. a, b, c and d) and you want to process only a and d (ignore b and c). You can set the following structure in your `package.json` file:
```json
{
  "name": "msr-test-yarn",
  "author": "Dave Houlbrooke <dave@shax.com",
  "version": "0.0.0-semantically-released",
  "private": true,
  "license": "0BSD",
  "engines": {
    "node": ">=8.3"
  },
  "workspaces": [
    "packages/*",
    "!packages/b/**",
    "!packages/c/**"
  ],
  "release": {
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator"
    ],
    "noCi": true
  }
}
```

### pnpm

Make sure to have a `packages` attribute inside your `pnpm-workspace.yaml` in the root of your project.
In there, you can set a list of packages that you might want to process in the msr process, as well as ignore others.
For example, let's say your project has 4 packages (i.e. a, b, c and d) and you want to process only a and d (ignore b and c). You can set the following structure in your `pnpm-workspace.yaml` file:

```yaml
packages:
  - 'packages/**'
  - '!packages/b/**'
  - '!packages/c/**'
```

**Note**, `workspace:` prefix in pkg versions is not supported yet. [issues/85](https://github.com/dhoulb/multi-semantic-release/issues/85) 

### bolt

Make sure to have a `bolt.workspaces` attribute inside your `package.json` project file.
In there, you can set a list of packages that you might want to process in the msr process, as well as ignore others.
For example, let's say your project has 4 packages (i.e. a, b, c and d) and you want to process only a and d (ignore b and c). You can set the following structure in your `package.json` file:

```json
{
  "name": "msr-test-bolt",
  "author": "Dave Houlbrooke <dave@shax.com",
  "version": "0.0.0-semantically-released",
  "private": true,
  "license": "0BSD",
  "engines": {
    "node": ">=8.3"
  },
  "bolt": {
    "workspaces": [
      "packages/*",
      "!packages/b/**",
      "!packages/c/**"
    ]
  },
  "release": {
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator"
    ],
    "noCi": true
  }
}
```

## CLI
There are several tweaks to adapt **msr** to some corner cases:

|Flag|Type|Description|Default|
|---|---|---|---|
|`--sequential-init`|bool   |Avoid hypothetical concurrent initialization collisions |`false`|
|`--debug`          |bool   |Output debugging information|`false`|
|`--first-parent`   |bool   |Apply commit filtering to current branch only|`false`|
|`--deps.bump`      |string |Define deps version update rule. `override` — replace any prev version with the next one, `satisfy` — check the next pkg version against its current references. If it matches (`*` matches to any, `1.1.0` matches `1.1.x`, `1.5.0` matches to `^1.0.0` and so on) release will not be triggered, if not `override` strategy will be applied instead; `inherit` will try to follow the current declaration version/range. `~1.0.0` + `minor` turns into `~1.1.0`, `1.x` + `major` gives `2.x`, but `1.x` + `minor` gives `1.x` so there will be no release, etc. +  **Experimental feat**  | `override`
|`--deps.release`   |string |Define release type for dependent package if any of its deps changes. `patch`, `minor`, `major` — strictly declare the release type that occurs when any dependency is updated; `inherit` — applies the "highest" release of updated deps to the package. For example, if any dep has a breaking change, `major` release will be applied to the all dependants up the chain. **Experimental feat** | `patch`
|`--dry-run`        |bool   |Dry run mode| `false`
|`--ignore-packages`|string |Packages list to be ignored on bumping process (append to the ones that already exist at package.json workspaces)|`null`
|`--ignore-private-packages`|bool |Private packages will be ignored |`false`

Examples:

```
$ multi-semantic-release --debug
$ multi-semantic-release --deps.bump=satisfy --deps.release=patch
$ multi-semantic-release --ignore-packages=packages/a/**,packages/b/**
```

You can also combine the CLI `--ignore-packages` options with the `!` operator at each package inside `package.json.workspaces` attribute. Even though you can use the CLI to ignore options, you can't use it to set which packages to be released – i.e. you still need to set the `workspaces` attribute inside the `package.json`.

⚠️ Keep in mind, that [`allowUnknownFlags`](https://github.com/sindresorhus/meow#allowunknownflags) is enabled, so the rest of flags will be passed to internal `semrel` call as `options` argument for all packages.

## API

multi-semantic-release default exports a `multirelease()` method which takes the following arguments:

- `packages` An array containing string paths to `package.json` files
- `options` An object containing default semantic-release configuration options

`multirelease()` returns an array of objects describing the result of the multirelease (corresponding to the `packages` array that is passed in).

```js
const multirelease = require("multi-semantic-release");

multirelease([
  `${__dirname}/packages/my-pkg-1/package.json`,
  `${__dirname}/packages/my-pkg-2/package.json`,
]);
```

## CI/CD
Multi-semantic release seems to be compatible with _many_ CI/CD systems. At least we are sure about three of them, here are examples of configurations:
- GitHub Actions → https://github.com/qiwi/semantic-release-toolkit
- Travis CI → https://github.com/qiwi/pijma
- AppVeyor → https://github.com/qiwi/masker

## Troubleshooting
### npm: invalid npm token
When releasing a monorepos you may get `EINVALIDNPMTOKEN` error. The more packages, the more chance of error, unfortunately.
```shell
INVALIDNPMTOKEN Invalid npm token.
The npm token (https://github.com/semantic-release/npm/blob/master/README.md#npm-registry-authentication) configured in the NPM_TOKEN environment variable must be a valid token (https://docs.npmjs.com/getting-started/working_with_tokens) allowing to publish to the registry https://registry.npmjs.org/.
```
Do not rush to change your token. _Perhaps_ this is related to [`npm whoami` request](https://github.com/semantic-release/npm/blob/master/lib/verify-auth.js#L21) throttling on your registry (just a hypothesis: https://github.com/semantic-release/npm/pull/416). At this point you can:
* Rerun your build as many times as necessary. You may get lucky in a new attempts.
* Patch standard semantic-release npm-plugin [like this](https://github.com/EricCrosson/patch-semantic-release-npm-for-msr).
* Use [semrel-extra/npm plugin](https://github.com/semrel-extra/npm) for npm publishing (recommended).

### git: connection reset by peer
This error seems to be related to concurrent git invocations ([issues/24](https://github.com/dhoulb/multi-semantic-release/issues/24)). Or may be not.
Anyway we've added a special [`--sequental-init`](#cli) flag to queue up these calls.


## Implementation notes (and other thoughts)

### Support for monorepos

Automatically finds packages as long as workspaces are configured as-per the workspace-feature of one of the support package managers.

- [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).
- [Npm workspaces (Version 7.x)](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [pnpm workspace](https://pnpm.js.org/workspaces/)
- [bolt workspaces](https://github.com/boltpkg/bolt#configuration)

I'm aware Lerna is the best-known tool right now, but in future it seems clear it will be replaced by functionality in Yarn and NPM directly. If you use Yarn workspaces today (January 2019), then publishing is the only remaining feature Lerna is _really_ required for (though it'd be lovely if Yarn added parallel script execution). Thus using multi-semantic-release means you can probably remove Lerna entirely from your project.

### Iteration vs coordination

Other packages that enable semantic-release for monorepos work by iterating into each package and running the `semantic-release` command. This is conceptually simple but unfortunately not viable because:

- If a package is published that depends on minor changes that have been made in a sibling package it could cause extremely subtle errors (the worst kind!) — if the project follows semver religiously this should never happen, but it's better to eliminate the _potential_ for errors
- Dependency version numbers need to reflect the _next_ release at time of publishing, so a package needs to know the state of _all other packages_ before it can publish correctly — this central state needs to be coordinated by something

### Local dependencies and version numbers

A key requirement is handling local dep version numbers elegantly. multi-semantic-release does the following:

- The next version number of all packages is established first
- If a release has not changed but has local deps that _have_ changed... do a `patch` bump on that package too
- Before packages are released (in semantic-release's prepare step), the correct current/next version number of _all_ local dependencies is written into the `package.json` file (overwriting any existing value)
- This ensures the package at the time of publishing will be atomically correct with all other packages in the monorepo.

The above means that, possibly, if someone upgrades dependencies and pulls down a package from NPM _during the multirelease_ (before all its deps have been published at their next versions), then their `npm install` will fail (it will work if they try again in a few minutes). On balance I thought it was more important to be atomically correct (this situation should be fairly rare assuming projects commit their lockfiles).

### Integration with semantic-release

This is the jankiest part of multi-semantic-release and most likely part to break relies. I expect this to cause maintenance issues down the line. In an ideal world semantic-release will bake-in support for monorepos (making this package unnecessary).

The way I ended up integrating is to create a custom "inline plugin" for semantic-release, and passing that in to `semanticRelease()` as the only plugin. This then calls any other configured plugins to retrieve and potentially modify the response.

The plugin starts all release at once, then pauses them (using Promises) at various points to allow other packages in the multirelease to catch up. This is mainly needed so the version number of all packages can be established _before_ any package is released. This allows us to do a `patch` bump on releases whose local deps have bumped, and to accurately write in the version of local deps in each `package.json`

The inline plugin does the following:

- **verifyConditions:** _not used_
- **analyzeCommits:**
  - Replaces `context.commits` with a list of commits filtered to the folder only
  - Calls `plugins.analyzeCommits()` to get the next release type (e.g. from @semantic-release/commit-analyzer)
  - Waits for _all_ packages to catch up to this point.
  - For packages that haven't bumped, checks if it has local deps (or deps of deps) that have bumped and returns `patch` if that's true
- **verifyRelease:** _not used_
- **generateNotes:**
  - Calls `plugins.generateNotes()` to get the notes (e.g. from @semantic-release/release-notes-generator)
  - Appends a section listing any local deps bumps (e.g. "my-pkg-2: upgraded to 1.2.1")
- **prepare:**
  - Writes in the correct version for local deps in `dependencies`, `devDependencies`, `peerDependencies` in `package.json`
  - Serialize the releases so they happen one-at-a-time (because semantic-release calls `git push` asynchronously, multiple releases at once fail because Git refs aren't locked — semantic-release should use `execa.sync()` so Git operations are atomic)
- **publish:** _not used_
- **success:** _not used_
- **fail:** _not used_

### Jank

The integration with semantic release is pretty janky — this is a quick summary of the reasons this package will be hard to maintain:

1. Had to filter `context.commits` object before it was used by `@semantic-release/commit-analyzer` (so it only lists commits for the corresponding directory).
  - The actual Git filtering is easy peasy: see [getCommitsFiltered.js](https://github.com/dhoulb/multi-semantic-release/blob/master/lib/getCommitsFiltered.js)
  - But overriding `context.commits` was very difficult! I did it eventually creating an _inline plugin_ and passing it into `semanticRelease()` via `options.plugins`
  - The inline plugin proxies between semantic release and other configured plugins. It does what it needs to then calls e.g. `plugins.analyzeCommits()` with an overridden `context.commits` — see [createInlinePluginCreator.js](https://github.com/dhoulb/multi-semantic-release/blob/master/lib/createInlinePluginCreator.js)
  - I think this is messy — inline plugins aren't even documented :(
2. Need to run the analyze commit step on *all* plugins before any proceed to the publish step
  - The inline plugin returns a Promise for every package then waits for all packages to analyze their commits before resolving them one at a time
  - If packages have local deps (e.g. `dependencies` in package.json points to an internal package) this step also does a `patch` bump if any of them did a bump.
  - This has to work recursively! See [hasChangedDeep.js](https://github.com/dhoulb/multi-semantic-release/blob/master/lib/hasChangedDeep.js)
3. The configuration can be layered (i.e. global `.releaserc` and then per-directory overrides for individual packages).
  - Had to duplicate the internal cosmiconfig setup from semantic release to get this working :(
4. I found Git getting itself into weird states because e.g. `git tag` is done asynchronously
  - To get around this I had to stagger package publishing so they were done one at a time (which slows things down)
  - I think calls to `execa()` in semantic release should be replaced with `execa.sync()` to ensure Git's internal state is atomic. 
  - Fortunately, another workaround has been implemented. `Synchronizer` is the neat part. It is critical to make the tag and commit publishing phases strictly sequential. [Event emitter allows](https://github.com/dhoulb/multi-semantic-release/blob/master/lib/getSynchronizer.js):
    - To synchronize release stages for all packages.
    - To ensure the completeness of checks and the sufficiency of conditions for a conflict-free process.

### Git tags

Releases always use a `tagFormat` of `my-pkg-1@1.0.1` for Git tags, and always overrides any `gitTag` set in semantic-release configuration.

I can personally see the potential for this option in coordinating a semantic-release (e.g. so two packages with the same tag always bump and release simultaneously). Unfortunately with the points of integration available in semantic-release, it was effectively impossible when releasing to stop a second package creating a duplicate tag (causing an error).

To make the `tagFormat` option work as intended the following would need to happen:

- semantic-release needs to check if a given tag already exists at a given commit, and not create it / push it if that's true
- Release notes for multiple package releases need to be merged BUT the Github release only done once (by having the notes merged at the semantic-release level but only published once, or having the Github plugin merge them)
- Make it clear in documentation that the default tag `v1.0.0` will have the same effect as Lerna's fixed mode (all changed monorepo packages released at same time)

## Contributing

Feel free to open any kind of issues: bugs, feature requests or questions.
You're always welcome to suggest a PR. Just fork this repo, write some code, add a pinch of tests and push your changes.
Any feedback is appreciated.

## Alternatives
- [intuit/auto](https://github.com/intuit/auto)
- [mateodelnorte/meta](https://github.com/mateodelnorte/meta)
- [pmowrer/semantic-release-monorepo](https://github.com/pmowrer/semantic-release-monorepo)

## License
[0BSD](./LICENSE.md)
