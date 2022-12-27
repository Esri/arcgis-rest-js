const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');

const SOURCE = path.join(__dirname, pkg.module);
const SOURCE_MAP = `${SOURCE}.map`;
const DESTINATION = path.join(__dirname, 'mjs', 'index.mjs');
const DESTINATION_MAP = `${DESTINATION}.map`;

function getFilename(filename) {
  const split = filename.split('/');

  return split[split.length - 1];
}

try {
  if (!fs.existsSync(path.join(__dirname, 'mjs'))) {
    fs.mkdirSync(path.join(__dirname, 'mjs'));
  }

  fs.copyFileSync(SOURCE, DESTINATION);

  const contents = fs
    .readFileSync(DESTINATION, { encoding: 'utf8' })
    .replace(/\/\/# sourceMappingURL=(.*)/, (match, value) => match.replace(value, 'index.mjs.map'));

  fs.writeFileSync(DESTINATION, contents, { encoding: 'utf8' });

  console.log(`Copied ${getFilename(SOURCE)} to ${getFilename(DESTINATION)}`);

  fs.copyFileSync(SOURCE_MAP, DESTINATION_MAP);

  console.log(`Copied ${getFilename(SOURCE_MAP)} to ${getFilename(DESTINATION_MAP)}`);
} catch (error) {
  console.error(error);

  process.exit(1);
}
