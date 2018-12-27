const Eyo = require('eyo-kernel');

function fixEyo(string) {
  const safeEyo = new Eyo();
  safeEyo.dictionary.loadSafeSync();

  return safeEyo.restore(string);
}

module.exports = fixEyo;
