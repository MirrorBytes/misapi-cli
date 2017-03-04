'use strict';
var Promise = require('bluebird');

function server(app) {
  this.app = app;
  this.connections = {};
  this.connectionId = 0;

  this.server = null;
}

server.prototype.start = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    try {
      self.server = self.app.listen(self.app.get('port'));
    } catch(e) {
      reject(e);
    } finally {
      self.server.on('connection', self.connection.bind(self));
      self.server.on('listening', function() {
        console.log('Listening...');
        resolve(self);
      });
    }
  });
};

server.prototype.connection = function(socket) {
  var self = this;

  self.connectionId++;
  socket._serverId = self.connectionId;

  socket.on('close', function() {
    delete self.connections[this._serverId];
  });

  self.connections[socket._serverId] = socket;
};

module.exports = server;
