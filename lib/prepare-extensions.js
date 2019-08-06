function prepareExtensions(value, previous) {
  return previous.concat([value]);
}

module.exports = prepareExtensions;
