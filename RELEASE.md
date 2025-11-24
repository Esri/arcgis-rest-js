# Release system

## v4

As of v4, the ArcGIS REST JS packages are released automatically via Semantic Release.

As of November 2025 ArcGIS REST JS uses trusted publishing for all packages configured through the `release.yml` file.

**Note:** Any new packages added are published at v1.0.0 instead of 4.0.0.

## v3

The release process has been entirely automated, but it is not perfect, so it requires some attentive human oversight.

The command below bumps the version in each individual package.json file and parses all `npm run c` invoked commit messages since the last release to update the changelog.

```bash
npm run release:prepare
```

Sometimes this step fails due to errors while parsing commit messages. See [these inline comments](https://github.com/Esri/arcgis-rest-js/blob/d8566a99dd1534e5eeae2ebfc5bfbffc679426d8/support/changelog.js#L78-L81) for how to modify the script and re-run the changelog generation script.

Afterwards, you can display a diff to give you a sense of what will be committed to master when you actually publish.

**Note:** Lerna only bumps the versions of packages that have changes or depends on packages that have changes. Not all packages will be bumped. This is expected.

```bash
npm run release:review
```

**IMPORTANT**

**Before publishing, you will likely need to make a few changes manually.**

First, lerna does **not** manage `peerDependencies`. We have to update them ourselves as needed. For example, if you've added a feature to a package (i.e. bumping minor) _and you've also updated other packages w/in the monorepo to use that feature_, you will need to manually update the `peerDependencies` of those other packages. Note that if you add features but they are not used w/in the monorepo, then you should **not** have to update any `peerDependencies`.

Second, you will likely need to manually update the `CHANGELOG.md` b/c the system to automates this is [far from perfect](https://github.com/Esri/arcgis-rest-js/issues/688). For example:

- It is very rare that anyone uses `npm run c`, so it is very likely that you will have to manually add changelog entries for whatever has changed since the last release
- Often the Unreleased section appears below the current release. So please move it to the top.

After you've made these changes, run `git add .` to stage it, and proceed.

The last command increments the version in the root package.json, pushes the new tag to GitHub and publishes a release of each individual package on npm.

NOTE: If you are using MFA at Github, have your personal access token handy because you will be prompted for your github username and password and you should proved your access token as the password. It is best to have this handy ahead of time and pay attention because there the process can timeout if you do not privide your credentials fast enough.

```bash
npm run release:publish
```
