#!/bin/bash

VERSION=$(node --eval "console.log(require('./lerna.json').version);")
TEMP_FOLDER=arcgis-rest-js-v$VERSION;

# commit the changes from npm run release:prepare
git add --all
git commit -am "Prepare v$VERSION" --no-verify

# incriment the package.json version to the lerna version so gh-release works
npm version $VERSION

# push the changes and tag to github
git push https://github.com/Esri/arcgis-rest-js.git master
git push --tags

# publish each package on npm
lerna exec -- npm publish

# create a ZIP archive of the dist files
mkdir $TEMP_FOLDER
cp packages/*/dist/umd/* $TEMP_FOLDER
zip -r $TEMP_FOLDER.zip $TEMP_FOLDER
rm -rf $TEMP_FOLDER

# Run gh-release to create a new release with our changelog changes and ZIP archive
gh-release --t v$VERSION --repo arcgis-rest-js --owner ArcGIS -a $TEMP_FOLDER.zip
