'use strict';
module.exports = {
  port: 3000,
  security: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        reportUri: '/report-violation',
        upgradeInsecureRequests: true
      },
      loose: false,
      reportOnly: false,
      setAllHeaders: false,
      disableAndroid: false,
      browserSniff: true
    },
    hidePoweredBy: { setTo: 'PHP 7.0.1' },
    frameguard: { action: 'sameorigin' },
    xssFilter: { setOnOldIE: true },
    dnsPrefetchControls: { allow: false }
  }
};
