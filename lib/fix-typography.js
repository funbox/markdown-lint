const Typograf = require('typograf');

const { getObjectPath } = require('./utils');

function fixTypography(string, { appConfig, externalConfig } = {}) {
  const tpConfig = Object.assign(
    {},
    getObjectPath(appConfig, 'typograf'),
    getObjectPath(externalConfig, 'typograf'),
  );
  const enableRules = tpConfig.enableRules || [];
  const disableRules = tpConfig.disableRules || [];
  const rulesSettings = tpConfig.rulesSettings || [];

  const tp = new Typograf({ locale: tpConfig.locale });

  enableRules.forEach(rule => tp.enableRule(rule));
  disableRules.forEach(rule => tp.disableRule(rule));
  rulesSettings.forEach(setting => tp.setSetting(...setting));

  return tp.execute(string);
}

module.exports = fixTypography;
