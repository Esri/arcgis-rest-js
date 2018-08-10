#!/bin/bash

# Make sure user is logged in to npm
npm whoami || exit 1

# Extract the version from lerna.json (this was updated by `npm run release:prepare`)
VERSION=$(node --eval "console.log(require('./lerna.json').version);")

# commit the changes from `npm run release:prepare`
git add --all
git commit -am "v$VERSION" --no-verify

# increment the package.json version to the lerna version so gh-release works
npm version $VERSION --allow-same-version --no-git-tag-version

# amend the changes from `npm version` to the release commit
git add --all
git commit -am "v$VERSION" --no-verify --amend

# tag this version
git tag v$VERSION

# push everything up to this point to master
git push https://github.com/Esri/arcgis-rest-js.git master

# push the new tag, not the old tags
git push https://github.com/Esri/arcgis-rest-js.git v$VERSION

# publish each package on npm
lerna publish --skip-git --yes --repo-version $VERSION --force-publish=*

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