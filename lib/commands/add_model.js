'use strict';
var chalk = require('chalk'),
    join = require('path').join;

var files = require('../files'),
    modelform = require('../modelform');

exports.command = 'add-model <modelName>';
exports.desc = 'Create new model in existing API.';
exports.builder = {};
exports.handler = function(argv) {
  var projBase;
  try {
    projBase = files.baseDirectory(process.cwd());
  } catch(err) {
    console.error(chalk.red('Not a project directory!'));
    return;
  }

  var pack = require(join(projBase.path ? projBase.path : projBase, 'package.json'));

  if(pack.misapi) {
    var single = argv.modelName.toLowerCase();
    single = single.charAt(0).toUpperCase() + single.slice(1);

    modelform(single, projBase.path ? projBase.path : projBase);
  } else {
    console.log(chalk.red('Not a MiSapi project!'));
  }
};
