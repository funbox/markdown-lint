const fs = require('fs');
const glob = require('glob');
const path = require('path');
const prettier = require('prettier');
const remark = require('remark');
const reporter = require('vfile-reporter');
const styleGuide = require('remark-preset-lint-markdown-style-guide');

function fixFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const prettyFileContent = prettier.format(fileContent, {
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
    .process(prettyFileContent, (error, result) => {
      if (error) throw new Error(error);

      if (result) {
        fs.writeFileSync(filePath, result);
      }
    });
}

function lintFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  remark()
    .use(styleGuide)
    .process(fileContent, (error, result) => {
      console.error(reporter(error || result, { quiet: true, defaultName: filePath }));

      if (result && result.messages && result.messages.length) {
        process.exitCode = 1;
      }
    });
}

function getFilesByPath(dir, recursive) {
  return glob.sync(recursive ? `${dir}/**/*.md` : `${dir}/*.md`, {
    root: path.resolve(process.cwd()),
    ignore: ['./node_modules/**', '**/node_modules/**'],
  });
}

async function markdownLint({ args = [], fix = false, recursive = false }) {
  const dirs = args
    .filter(arg => fs.existsSync(arg) && fs.statSync(arg).isDirectory());
  const files = args
    .filter(arg => /.+\.md$/i.test(arg))
    .filter(arg => fs.existsSync(arg) && fs.statSync(arg).isFile());

  if (dirs.length) {
    await Promise.all(dirs.map(async dir => {
      const filesByPath = getFilesByPath(dir, recursive);

      files.push(...filesByPath);
    }));
  }

  await Promise.all(files.map(async (file) => {
    if (fix) {
      fixFile(file);
    }

    lintFile(file);
  }));
}

module.exports = markdownLint;
