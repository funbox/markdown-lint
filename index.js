const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const remark = require('remark');
const reporter = require('vfile-reporter');
const textr = require('remark-textr');
const Typograf = require('typograf');

const { getFilesByPath, getObjectPath } = require('./lib/utils');
const yoficator = require('./lib/yoficator');

const appConfig = require('./.markdownlintrc');

function fixTypography(string, externalConfig) {
  const tpConfig = Object.assign(
    {},
    getObjectPath(appConfig, 'typograf'),
    getObjectPath(externalConfig, 'typograf'),
  );
  const enableRules = tpConfig.enableRules || [];
  const disableRules = tpConfig.disableRules || [];
  const rulesSettings = tpConfig.rulesSettings || [];

  const tp = new Typograf({ locale: tpConfig.locale });

  enableRules.forEach(rule => tp.enableRule(rule));
  disableRules.forEach(rule => tp.disableRule(rule));
  rulesSettings.forEach(setting => tp.setSetting(...setting));

  return tp.execute(string);
}

function fixFile(fileContent, { externalConfig, typograph } = {}) {
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

  if (typograph) {
    processor.use(textr, { plugins: [input => fixTypography(input, externalConfig)] });
  }

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
