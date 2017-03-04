'use strict';
var router = require('express').Router(),
    requireDirectory = require('require-directory');

var logger = require('./utils/logger');

function assembleRoute(routes, routesKeys, fullRoute) {
  var curRoute;
  for(var routesLength = routesKeys.length;routesLength--;) {
    curRoute = routesKeys[routesLength];
    if(curRoute !== 'index' && typeof routes[curRoute].index === 'undefined') {
      logger.error(curRoute + '.index must be an object populated with any number of CRUD functions.');
    }

    if(typeof fullRoute === 'undefined') {
      fullRoute = '/' + curRoute;
    } else {
      fullRoute += '/' + curRoute;
    }

    var curRouteKeys = Object.keys(routes[curRoute]);
    for(var keysLength = curRouteKeys.length;keysLength--;) {
      if(curRouteKeys[keysLength] === 'index') {
        var obj = routes[curRoute][curRouteKeys[keysLength]];

        router.route(fullRoute)
          .get(obj.getAll)
          .post(obj.create);

        router.route(fullRoute + '/:' + curRoute)
          .get(obj.getOne)
          .put(obj.update)
          .delete(obj.remove);

        fullRoute = '';
      } else if(curRouteKeys[keysLength] !== 'lib') {
        var nextRoutes = routes[curRoute][curRouteKeys[keysLength]];
        assembleRoute(
          { [curRouteKeys[keysLength]]: nextRoutes },
          Object.keys({ [curRouteKeys[keysLength]]: nextRoutes }),
          fullRoute + '/:' + curRoute
        );
      }
    }
  }
}

module.exports = function(app, directory) {
  var routes = requireDirectory(module, directory),
      routesKeys = Object.keys(routes);

  assembleRoute(routes, routesKeys);

  app.use('/api', router);
};
