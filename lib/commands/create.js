'use strict';
var join = require('path').join,
    shell = require('shelljs'),
    chalk = require('chalk'),
    commandExists = require('command-exists');

var files = require('../files');

exports.command = 'create <apiName>';
exports.desc = 'Create a new API.';
exports.builder = {
  version: {
    alias: 'v',
    describe: 'Application version',
    demand: true
  },
  author: {
    alias: 'a',
    describe: 'Application author',
    demand: true
  },
  desc: {
    alias: 'd',
    describe: '(optional) Application description',
    demand: false
  }
};
exports.handler = function(argv) {
  var apiName = argv.apiName,
      folderSrc = join(__dirname, '../../scaffolding/create/*'),
      folderDest = join(process.cwd(), apiName);

  if(!files.directoryExists(folderDest)) shell.mkdir('-p', folderDest);

  var pack = shell.ShellString('{\n\t"name": "' + apiName + '",\n\t"version": "' + argv.version + '",\n\t"description": "' + argv.desc + '",\n\t"main": "index.js",\n\t"author": "' + argv.author + '",\n\t"license": "MIT",\n\t"misapi": true,\n\t"dependencies": {\n\t\t"bluebird": "^3.4.7",\n\t\t"body-parser": "^1.16.1",\n\t\t"compression": "^1.6.2",\n\t\t"express": "^4.14.1",\n\t\t"helmet": "^3.4.0",\n\t\t"mongoose": "^4.8.5",\n\t\t"morgan": "^1.8.1",\n\t\t"require-directory": "^2.1.1",\n\t\t"winston": "^2.3.1"\n\t}\n}');
  pack.to(join(folderDest, 'package.json'));
  console.log(chalk.cyan('package.json created!'));

  shell.cp('-Rf', folderSrc, folderDest);
  console.log(chalk.cyan('api created!'));

  commandExists('yarn', function(err, cExists) {
    if(err) {
      console.log(err);
      console.dir(err);
      return;
    }

    if(cExists) {
      shell.exec('cd ' + argv.apiName + ' && yarn install');
    } else {
      shell.exec('cd ' + argv.apiName + ' && npm install');
    }
  })
};
