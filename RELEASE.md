# Release system

The release process has been entirely automated, but it is not perfect, so it requires some attentive human oversight.

The command below bumps the version in each individual package.json file and parses all `npm run c` invoked commit messages since the last release to update the changelog.

```bash
npm run release:prepare
```

Sometimes this step fails due to errors while parsing commit messages. See [these inline comments](https://github.com/Esri/arcgis-rest-js/blob/d8566a99dd1534e5eeae2ebfc5bfbffc679426d8/support/changelog.js#L78-L81) for how to modify the script and re-run the changelog generation script.

Afterwards, you can display a diff to give you a sense of what will be committed to master when you actually publish.

```bash
npm run release:review
```

**IMPORTANT** 

Before publishing, you will likely need to make a few chages to `CHANGELOG.md` b/c the system to automates this is [far from perfect](https://github.com/Esri/arcgis-rest-js/issues/688). For example:
- It is very rare that anyone uses `npm run c`, so it is very likely that you will have to manually add changelog entries for whatever has changed since the last release
- Often the Unreleased section appears below the current release. So please move it to the top.

Once the changelog looks good, run `git add .` to stage it, and proceed.

The last command increments the version in the root package.json, pushes the new tag to GitHub and publishes a release of each individual package on npm.

```bash
npm run release:publish
```
