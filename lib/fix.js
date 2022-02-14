const prettier = require('prettier');
const remark = require('remark');
const textr = require('remark-textr');

const fixEyo = require('./fix-eyo');
const fixTypography = require('./fix-typography');
const { getObjectPath } = require('./utils');

function fix(string, { appConfig, externalConfig, typograph } = {}) {
  // https://prettier.io/docs/en/options.html
  let prettyString = prettier.format(
    string,
    {
      ...getObjectPath(appConfig, 'prettier'),
      ...getObjectPath(externalConfig, 'prettier'),
    },
  );

  // https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options
  const remarkStringify = {
    settings: {
      ...getObjectPath(appConfig, 'remark.stringifySettings'),
      ...getObjectPath(externalConfig, 'remark.stringifySettings'),

    },
  };

  const processor = remark().use(remarkStringify);

  if (typograph) {
    prettyString = fixEyo(prettyString);

    processor.use(textr, {
      plugins: [
        input => fixTypography(input, { appConfig, externalConfig }),
      ],
    });
  }

  return processor.processSync(prettyString).toString();
}

module.exports = fix;
