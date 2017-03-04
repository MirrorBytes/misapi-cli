#!/usr/bin/env node

'use strict';
var clear = require('clear'),
    chalk = require('chalk'),
    figlet = require('figlet'),
    yargs = require('yargs'),
    join = require('path').join,
    resolve = require('path').resolve;

var files = require('./lib/files');

clear();
console.log(
  chalk.green(
    figlet.textSync('MiSapi', {
      horizontalLayout: 'full'
    })
  )
);

var cwd = resolve(yargs.argv.cwd || process.cwd());
process.chdir(cwd);

yargs
  .commandDir(join(__dirname, 'lib', 'commands'))
  .options({ cwd: { desc: 'Change the current working directory' } })
  .help()
  .argv;
