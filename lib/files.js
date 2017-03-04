'use strict';
var join = require('path').join,
    resolve = require('path').resolve,
    basename = require('path').basename,
    fs = require('fs');

module.exports = {
  baseDirectory: function(path) {
    try {
      var pack = fs.statSync(join(path.path ? path.path : path, '/', 'package.json'));

      return path;
    } catch(err) {
      return this.baseDirectory({
        path: resolve(join(path.path ? path.path : path, '..')),
        routeBase: path.routeBase ? path.routeBase : (basename(path.path ? path.path : path) === 'route' ? (path.path ? path.path : path) : false)
      });
    }
  },
  directoryExists: function(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch(err) {
      return false;
    }
  }
};
