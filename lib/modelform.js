'use strict';
var inquirer = require('inquirer'),
    figlet = require('figlet'),
    chalk = require('chalk'),
    clear = require('clear'),
    shell = require('shelljs'),
    join = require('path').join;

var files = require('./files');

if(typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if(target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for(var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if(nextSource != null) { // Skip over if undefined or null
        for(var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if(Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

module.exports = function(name, projBase) {
  var dataTypes = [
    'String',
    'Number',
    'Date',
    'Buffer',
    'Boolean',
    'Mixed',
    'ObjectId',
    'Array'
  ], questions = [
    {
      type: 'input',
      name: 'key',
      message: 'Enter field key:',
      validate: function(value) {
        if(value.length) {
          return true;
        } else {
          return 'Please enter field key:';
        }
      }
    }, {
      type: 'list',
      name: 'type',
      message: 'Select field data type:',
      choices: dataTypes
    }, {
      when: function(value) {
        return value.type === 'Array';
      },
      type: 'list',
      name: 'arrayType',
      message: 'Select Array\'s content data type:',
      choices: dataTypes.slice(0, dataTypes.length - 1)
    }, {
      when: function(value) {
        return value.arrayType === 'ObjectId';
      },
      type: 'input',
      name: 'reference',
      message: 'What model is this Array holding references to?',
      validate: function(value) {
        if(value.length) {
          return true;
        } else {
          return 'Please enter model that Array is holding references to:';
        }
      }
    }, {
      when: function(value) {
        return value.type !== 'Array';
      },
      type: 'input',
      name: 'options',
      message: 'Enter an options object:'
    }, {
      type: 'confirm',
      name: 'continue',
      message: 'Would you like to add another field?',
      default: true
    }
  ], fields = [];

  function buildModel() {
    var model = '\'use strict\';\nvar mongoose = require(\'mongoose\');\n\nvar ' + name + 'Schema = new mongoose.Schema({\n';

    for(var fieldsLength = fields.length;fieldsLength--;) {
      model += '\t' + fields[fieldsLength].key + ': ';
      if(fields[fieldsLength].type === 'Array') {
        model += (fields[fieldsLength].arrayType ? '[' + (fields[fieldsLength].reference ? '{ type: ' + ('mongoose.Schema.Types.' + fields[fieldsLength].arrayType) + ', ref: \'' + ((fields[fieldsLength].reference).charAt(0).toUpperCase() + (fields[fieldsLength].reference).slice(1)) + '\' }': ('mongoose.Schema.Types.' + fields[fieldsLength].arrayType)) + ']' : 'mongoose.Schema.Types.Array');
      } else {
        if(fields[fieldsLength].options) {
          model += '{ type: mongoose.Schema.Types.' + fields[fieldsLength].type + ', ' + fields[fieldsLength].options + ' }';
        } else {
          model += 'mongoose.Schema.Types.' + fields[fieldsLength].type;
        }
      }
      model += (fieldsLength ? ',\n' : '\n');
    }

    model += '});\n\nmodule.exports = mongoose.model(\'' + name + '\', ' + name + 'Schema);';

    if(!files.directoryExists(join(projBase, 'models'))) shell.mkdir('-p', join(projBase, 'models'));
    shell.ShellString(model).to(join(projBase, 'models', name.toLowerCase() + '.js'));
    console.log(chalk.cyan('model added!'));
  }
  function promptOrFinish(answers) {
    var answersKeys = Object.keys(answers);
    if(answersKeys.length) {
      fields.push(answers);

      if(answers.continue) {
        clear();
        console.log(
          chalk.green(
            figlet.textSync('MiSapi', {
              horizontalLayout: 'full'
            })
          )
        );

        inquirer.prompt(questions).then(promptOrFinish);
      } else {
        clear();
        console.log(
          chalk.green(
            figlet.textSync('MiSapi', {
              horizontalLayout: 'full'
            })
          )
        );
        buildModel();
      }
    }
  }
  inquirer.prompt(questions).then(promptOrFinish).catch(function(err) {
    console.log(err);
  });
};
