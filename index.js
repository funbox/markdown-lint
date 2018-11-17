const fs = require('fs');
const glob = require('glob');
const path = require('path');
const prettier = require('prettier');
const remark = require('remark');
const reporter = require('vfile-reporter');

const appConfig = require('./.markdownlintrc');

function fixFile(fileContent, externalConfig) {
  // https://prettier.io/docs/en/options.html
  const prettyFileContent = prettier.format(fileContent, Object.assign(
    appConfig && appConfig.prettier
      ? appConfig.prettier
      : {},
    externalConfig && externalConfig.prettier
      ? externalConfig.prettier
      : {},
  ));

  // https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options
  const remarkStringify = {
    settings: Object.assign(
      appConfig && appConfig.remark && appConfig.remark.settings
        ? appConfig.remark.settings
        : {},
      externalConfig && externalConfig.remark && externalConfig.remark.settings
        ? externalConfig.remark.settings
        : {},
    ),
  };

  const processor = remark().use(remarkStringify);

  try {
    return processor.processSync(prettyFileContent).toString();
  } catch (error) {
    throw error;
  }
}

function lintFile(fileContent, filePath, externalConfig) {
  /* eslint-disable import/no-extraneous-dependencies */
  remark()
    .use(appConfig && appConfig.remark && appConfig.remark.plugins)
    .use(externalConfig && externalConfig.remark && externalConfig.remark.plugins)
    .process(fileContent, (error, result) => {
      if (error) {
        process.exitCode = 1;
        throw error;
      }

      if (result.messages.length) {
        process.exitCode = 1;
        console.error(reporter(result, { defaultName: filePath }), '\n');
      }
    });
  /* eslint-enable import/no-extraneous-dependencies */
}

function getFilesByPath(dir, recursive) {
  return glob.sync(recursive ? `${dir}/**/*.md` : `${dir}/*.md`, {
    root: path.resolve(process.cwd()),
    ignore: ['./node_modules/**', '**/node_modules/**'],
  });
}

async function markdownLint({ args = [], fix = false, recursive = false, config }) {
  const dirs = args
    .filter(arg => fs.existsSync(arg) && fs.statSync(arg).isDirectory());
  const files = args
    .filter(arg => /.+\.md$/i.test(arg))
    .filter(arg => fs.existsSync(arg) && fs.statSync(arg).isFile());
  let externalConfig;

  if (config) {
    // eslint-disable-next-line import/no-dynamic-require
    externalConfig = require(path.resolve(config));
  }

  if (dirs.length) {
    await Promise.all(dirs.map(async dir => {
      const filesByPath = getFilesByPath(dir, recursive);

      files.push(...filesByPath);
    }));
  }

  await Promise.all(files.map(async (filePath) => {
    let fileContent = fs.readFileSync(filePath, 'utf8');

    if (fix) {
      try {
        fileContent = fixFile(fileContent, externalConfig);
        fs.writeFileSync(filePath, fileContent);
      } catch (error) {
        process.exitCode = 1;
        throw error;
      }
    }

    lintFile(fileContent, filePath, externalConfig);
  }));
}

module.exports = markdownLint;
