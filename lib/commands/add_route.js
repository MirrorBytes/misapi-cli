'use strict';
var chalk = require('chalk'),
    join = require('path').join,
    shell = require('shelljs'),
    fs = require('fs');

var files = require('../files'),
    modelform = require('../modelform');

exports.command = 'add-route <routeName>';
exports.desc = 'Create new route in existing API.';
exports.builder = {
  nomodel: {
    alias: 'n',
    describe: '(optional) Will not create model in association with route.',
    demand: false
  }
};
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
    var routeName = argv.routeName.toLowerCase(),
        routeFolderSrc = join(__dirname, '../../scaffolding/add/route/*'),
        routeFolderDest = (
          projBase.routeBase ?
            join(process.cwd(), routeName) :
            join(projBase.path ? projBase.path : projBase, 'routes', routeName)
        );

    if(!files.directoryExists(routeFolderDest)) shell.mkdir('-p', routeFolderDest);
    shell.cp('-Rf', routeFolderSrc, routeFolderDest);
    console.log(chalk.cyan('route added!'));

    // TODO: Test creation of very basic logic for `routeFolderDest`'s lib files

    if(!argv.nomodel) {
      var single = (routeName.slice(-1) === 's' ? routeName.slice(0, -1) : routeName);
      single = single.charAt(0).toUpperCase() + single.slice(1);
    }

    var lib = join(routeFolderDest, 'lib');
    fs.readdir(lib, function(err, files) {
      if(err) console.log(err);

      var curFile;
      for(var filesLength = files.length;filesLength--;) {
        curFile = fs.readFileSync(join(lib, files[filesLength]), 'utf-8');

        try {
          fs.writeFileSync(join(lib, files[filesLength]), curFile.replace(/\/\*\*\* MODELS HERE \*\//, (argv.nomodel ? '' : 'var ' + single + ' = require(\'' + join(projBase, 'models', single.toLowerCase()) + '\');')), 'utf-8');
        } catch(err) {
          console.log(err);
          console.dir(err);
          return;
        }
      }

      console.log(chalk.cyan('route\'s lib files altered!'));

      if(!argv.nomodel) modelform(single, projBase.path ? projBase.path : projBase);
    });
  } else {
    console.log(chalk.red('Not a MiSapi project!'));
  }
};
