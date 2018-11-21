const fs = require('fs');
const glob = require('glob');
const path = require('path');
const prettier = require('prettier');
const remark = require('remark');
const reporter = require('vfile-reporter');

const getObjectPath = require('./utils/get-object-path');

const appConfig = require('./.markdownlintrc');

function fixFile(fileContent, externalConfig) {
  // https://prettier.io/docs/en/options.html
  const prettyFileContent = prettier.format(
    fileContent,
    Object.assign(
      {},
      getObjectPath(appConfig, 'prettier'),
      getObjectPath(externalConfig, 'prettier'),
    ),
  );

  // https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options
  const remarkStringify = {
    settings: Object.assign(
      {},
      getObjectPath(appConfig, 'remark.stringifySettings'),
      getObjectPath(externalConfig, 'remark.stringifySettings'),
    ),
  };

  const processor = remark().use(remarkStringify);

  return processor
    .processSync(prettyFileContent)
    .toString();
}

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

function getFilesByPath(dir, recursive) {
  return glob.sync(recursive ? `${dir}/**/*.+(md|MD)` : `${dir}/*.+(md|MD)`, {
    root: process.cwd(),
    ignore: ['./node_modules/**', '**/node_modules/**'],
  });
}

function markdownLint({ paths = [], fix = false, recursive = false, config }) {
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
      fileContent = fixFile(fileContent, externalConfig);
      fs.writeFileSync(filePath, fileContent);
    }

    lintFile(fileContent, filePath, externalConfig);
  }
}

module.exports = markdownLint;
