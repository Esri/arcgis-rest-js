#!/bin/bash

# Extract the version from lerna.json (this was updated by `npm run release:prepare`)
VERSION=$(node --eval "console.log(require('./lerna.json').version);")

# commit the changes from `npm run release:prepare`
git add --all
git commit -am "v$VERSION" --no-verify

# sync the package.json version to the lerna version so gh-release works
npm version $VERSION --allow-same-version --no-git-tag-version

# amend the changes from `npm version` to the release commit
git add package.json
git commit -m"v$VERSION" --no-verify --amend

# push everything up to this point to master
git push https://github.com/Esri/arcgis-rest-js.git master

# checkout temp branch for release
git checkout -b release-v$VERSION

# add built files to the release commit
git add packages/*/dist -f

# commit the built files
git commit -am"Publish v$VERSION" --no-verify

# tag the release
git tag v$VERSION

# push the release commit and tag to github
git push https://github.com/Esri/arcgis-rest-js.git release-v$VERSION
git push --tags

# publish each package on npm
lerna publish --skip-git --yes --repo-version $VERSION

# create a ZIP archive of the dist files
TEMP_FOLDER=arcgis-rest-js-v$VERSION;
mkdir $TEMP_FOLDER
cp packages/*/dist/umd/* $TEMP_FOLDER
zip -r $TEMP_FOLDER.zip $TEMP_FOLDER
rm -rf $TEMP_FOLDER

# Run gh-release to create a new release with our changelog changes and ZIP archive
gh-release --t v$VERSION --repo arcgis-rest-js --owner Esri -a $TEMP_FOLDER.zip

# Delete the ZIP archive
rm $TEMP_FOLDER.zip

# checkout master and delete release branch locally and on GitHub
git checkout master
git branch -D release-v$VERSION
git push upstream :release-v$VERSION