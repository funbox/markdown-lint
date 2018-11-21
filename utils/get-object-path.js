module.exports = (val, path) => path.toString()
  .split('.')
  .reduce((branch, key) => (branch ? branch[key] : undefined), val);
