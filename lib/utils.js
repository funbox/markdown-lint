const glob = require('glob');

function getFilesByPath(dir, ext, recursive) {
  return glob.sync(recursive ? `${dir}/**/*.+(${ext})` : `${dir}/*.+(${ext})`, {
    root: process.cwd(),
    ignore: ['./node_modules/**', '**/node_modules/**'],
  });
}

function getObjectPath(val, path) {
  return path.toString()
    .split('.')
    .reduce((branch, key) => (branch ? branch[key] : undefined), val);
}

function prepareExtensions(value, previous) {
  return previous.concat([value]);
}

module.exports = { getFilesByPath, getObjectPath, prepareExtensions };
