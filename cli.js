#!/usr/bin/env node

const program = require('commander');
const markdownLint = require('.');

program
  .option('--fix', 'automatically fix problems');

program
  .version(require('./package').version, '-v, --version')
  .description(require('./package').description)
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  markdownLint({
    args: program.args,
    isFix: program.fix,
  });
}
