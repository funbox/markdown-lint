#!/usr/bin/env node

const program = require('commander');
const markdownLint = require('.');

program
  .option('--fix', 'automatically fix problems')
  .option('-r, --recursive', 'get files from provided directory and the entire subtree');

program
  .usage('[options] <dir> <file ...>')
  .version(require('./package').version, '-v, --version')
  .description(require('./package').description)
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  markdownLint({
    args: program.args,
    fix: program.fix,
    recursive: program.recursive,
  });
}
