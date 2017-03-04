'use strict';
var path = require('path');

var core = require('./core/'),
    logger = require('./core/utils/logger');

core({
  /**
   * Possible options:
   * - port
   * - security
   * - routes
   * - mongoURI
   */
}).then(function(server) {
  if(server.constructor !== Error) {
    server.start();
  } else {
    logger.error(server);
  }
});
