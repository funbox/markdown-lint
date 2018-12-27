const Eyo = require('eyo-kernel');

function yoficator(string) {
  const safeEyo = new Eyo();
  safeEyo.dictionary.loadSafeSync();

  return safeEyo.restore(string);
}

module.exports = yoficator;
