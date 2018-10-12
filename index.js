const fs = require('fs');
const prettier = require('prettier');
const remark = require('remark');
const reporter = require('vfile-reporter');
const styleGuide = require('remark-preset-lint-markdown-style-guide');

function fixFile(file) {
  const fileContent = fs.readFileSync(file, 'utf8');
  const prettyString = prettier.format(fileContent, {
    parser: 'markdown',
    printWidth: 80,
    proseWrap: 'always',
  });

  remark()
    .use({
      // `remark-stringify` settings.
      settings: {
        listItemIndent: '1',
      },
    })
    .process(prettyString, (error, result) => {
      if (error) throw new Error(error);

      if (result) {
        fs.writeFileSync(file, result);
      }
    });
}

function lintFile(file) {
  remark()
    .use(styleGuide)
    .process(fs.readFileSync(file, 'utf8'), (error, result) => {
      console.error(reporter(error || result, { quiet: true, defaultName: file }));

      if (result && result.messages && result.messages.length) {
        process.exitCode = 1;
      }
    });
}

async function markdownLint({ args = [], isFix = false }) {
  const files = args.filter(arg => /.+\.md$/i.test(arg));

  if (isFix) {
    await Promise.all(files.map(async file => fixFile(file)));
  }

  await Promise.all(files.map(async file => lintFile(file)));
}

module.exports = markdownLint;
