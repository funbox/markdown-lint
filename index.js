const fs = require('fs');
const path = require('path');

const fixFile = require('./lib/fix');
const fixEyo = require('./lib/fix-eyo');
const lintFile = require('./lib/lint');
const { getFilesByPath } = require('./lib/utils');

const appConfig = require('./.markdownlintrc');

function markdownLint({ paths = [], fix, recursive, config, typograph }) {
  const dirs = paths.filter(p => fs.existsSync(p) && fs.statSync(p).isDirectory());
  const files = paths
    .filter(p => /.+\.md$/i.test(p) && fs.existsSync(p) && fs.statSync(p).isFile())
    .concat(...(dirs.map(d => getFilesByPath(d, recursive))));

  // eslint-disable-next-line import/no-dynamic-require
  const externalConfig = config && require(path.resolve(config));

  // eslint-disable-next-line no-restricted-syntax
  for (const filePath of files) {
    let fileContent = fs.readFileSync(filePath, 'utf8');

    if (fix) {
      fileContent = fixFile(fileContent, {
        appConfig,
        externalConfig,
        typograph,
      });

      if (typograph) {
        fileContent = fixEyo(fileContent);
      }

      fs.writeFileSync(filePath, fileContent);
    }

    lintFile(fileContent, {
      appConfig,
      externalConfig,
      filePath,
    });
  }
}

module.exports = markdownLint;
