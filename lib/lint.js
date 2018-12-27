const remark = require('remark');
const reporter = require('vfile-reporter');

const { getObjectPath } = require('./utils');

function lint(fileContent, { appConfig, externalConfig, filePath } = {}) {
  remark()
    .use(getObjectPath(appConfig, 'remark.plugins'))
    .use(getObjectPath(externalConfig, 'remark.plugins'))
    .process(fileContent, (error, result) => {
      if (error) throw error;

      if (result.messages.length) {
        process.exitCode = 1;
        console.error(reporter(result, { defaultName: filePath }), '\n');
      }
    });
}

module.exports = lint;
