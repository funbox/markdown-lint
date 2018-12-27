const prettier = require('prettier');
const remark = require('remark');
const textr = require('remark-textr');

const fixTypography = require('./fix-typography');
const { getObjectPath } = require('./utils');

function fix(string, { appConfig, externalConfig, typograph } = {}) {
  // https://prettier.io/docs/en/options.html
  const prettyString = prettier.format(
    string,
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
    processor.use(textr, {
      plugins: [
        input => fixTypography(input, { appConfig, externalConfig }),
      ],
    });
  }

  return processor.processSync(prettyString).toString();
}

module.exports = fix;
