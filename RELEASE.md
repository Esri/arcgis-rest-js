# Release system

The release process has been entirely automated, but it is not perfect, so it requires some attentive human oversight.

The command below bumps the version in each individual package.json file and parses all `npm run c` invoked commit messages since the last release to update the changelog.

```bash
npm run release:prepare
```

For some reason, in CHANGELOG.md, the unreleased section appears below this release. So please move it to the top.

Afterwards, you can display a diff to give you a sense of what will be committed to master when you actually publish.

```bash
npm run release:review
```

The last command increments the version in the root package.json, pushes the new tag to GitHub and publishes a release of each individual package on npm.

```bash
npm run release:publish
```
