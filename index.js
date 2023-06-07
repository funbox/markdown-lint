const fs = require('node:fs');
const path = require('node:path');

const fixFile = require('./lib/fix');
const lintFile = require('./lib/lint');
const { getFilesByPath } = require('./lib/utils');

const appConfig = require('./.markdownlintrc');

function markdownLint({ paths = [], fix, ext, recursive, config, typograph }) {
  const dirs = paths.filter(p => fs.existsSync(p) && fs.statSync(p).isDirectory());
  const extensions = ext.join('|');
  const extensionsRegExp = new RegExp(`.+\\.(${extensions})$`, 'i');

  const files = paths
    .filter(p => extensionsRegExp.test(p) && fs.existsSync(p) && fs.statSync(p).isFile())
    .concat(...(dirs.map(d => getFilesByPath(d, extensions, recursive))));

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
