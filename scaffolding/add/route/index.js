'use strict';
var get = require('./lib/get'),
    create = require('./lib/create'),
    update = require('./lib/update'),
    remove = require('./lib/remove');

module.exports = {
  getAll: function(req, res) {
    get.All(req, res);
  },
  getOne: function(req, res) {
    get.One(req, res);
  },
  create: function(req, res) {
    create(req, res);
  },
  update: function(req, res) {
    update(req, res);
  },
  remove: function(req, res) {
    remove(req, res);
  }
};
