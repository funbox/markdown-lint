const fs = require('fs');
const glob = require('glob');
const path = require('path');
const prettier = require('prettier');
const remark = require('remark');
const reporter = require('vfile-reporter');
const styleGuide = require('remark-preset-lint-markdown-style-guide');

function fixFile(fileContent) {
  const prettyFileContent = prettier.format(fileContent, {
    parser: 'markdown',
    printWidth: 80,
    proseWrap: 'always',
  });

  const processor = remark()
    .use({ // `remark-stringify` settings.
      settings: {
        listItemIndent: '1',
      },
    });

  try {
    return processor.processSync(prettyFileContent).toString();
  } catch (error) {
    throw error;
  }
}

function lintFile(fileContent, filePath) {
  remark()
    .use(styleGuide)
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

  await Promise.all(files.map(async (filePath) => {
    let fileContent = fs.readFileSync(filePath, 'utf8');

    if (fix) {
      try {
        fileContent = fixFile(fileContent);
        fs.writeFileSync(filePath, fileContent);
      } catch (error) {
        process.exitCode = 1;
        throw error;
      }
    }

    lintFile(fileContent, filePath);
  }));
}

module.exports = markdownLint;
