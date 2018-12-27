const fs = require('fs');
const path = require('path');
const remark = require('remark');
const reporter = require('vfile-reporter');

const fixFile = require('./lib/fix');
const { getFilesByPath, getObjectPath } = require('./lib/utils');
const yoficator = require('./lib/yoficator');

const appConfig = require('./.markdownlintrc');

function lintFile(fileContent, filePath, externalConfig) {
  remark()
    .use(getObjectPath(appConfig, 'remark.plugins'))
    .use(getObjectPath(externalConfig, 'remark.plugins'))
    .process(fileContent, (error, result) => {
      if (error) throw error;

      if (result.messages.length) {
        process.exitCode = 1;
        console.error(reporter(result, { defaultName: filePath }), '\n');
      }
    });
}

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
        fileContent = yoficator(fileContent);
      }

      fs.writeFileSync(filePath, fileContent);
    }

    lintFile(fileContent, filePath, externalConfig);
  }
}

module.exports = markdownLint;
