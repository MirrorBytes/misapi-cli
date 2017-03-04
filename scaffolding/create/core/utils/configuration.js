'use strict';
var Promise = require('bluebird'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    mongoose = require('mongoose'),
    morgan = require('morgan');

var logger = require('./logger'),
    defaults = require('./defaults');

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

module.exports = function(app, options) {
  logger.debug('Setting port to ' + (process.env.PORT || options.port || defaults.port) + '.');
  app.set('port', process.env.PORT || options.port || defaults.port);
  logger.debug('Enabling helmet');
  app.use(helmet(Object.assign({}, defaults.security, options.security)));

  logger.debug('Enabling body parser w/ parse urlencoded request bodies');
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json({
    type: [ 'json', 'application/csp-report' ]
  }));
  logger.debug('Enabling GZip Compression');
	app.use(compression());

  mongoose.Promise = Promise;
  mongoose.connect(options.mongoURI || 'mongodb://localhost:27017');

  app.use(morgan('combined', {
    'stream': logger.stream
  }));

  app.post(defaults['security']['contentSecurityPolicy']['directives'].reportUri, function(req, res) {
    if(req.body) {
      logger.error('CSP Violation: ', req.body);
    } else {
      logger.error('CSP Violation: No data received!');
    }

    res.status(204).end();
  });
};
