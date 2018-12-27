const glob = require('glob');

function getFilesByPath(dir, recursive) {
  return glob.sync(recursive ? `${dir}/**/*.+(md|MD)` : `${dir}/*.+(md|MD)`, {
    root: process.cwd(),
    ignore: ['./node_modules/**', '**/node_modules/**'],
  });
}

module.exports = { getFilesByPath };
