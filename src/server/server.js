var log = require('./logger');
var fs = require('fs');

module.exports = function(app) {

  var server;

  if (appConfig.http.tls.enabled) {
    try {
      server = require('https').Server(
        {
          key: fs.readFileSync(appConfig.http.tls.key),
          cert: fs.readFileSync(appConfig.http.tls.cert)
        },
        app
      );
      log.info('Server enabled TLS');
    } catch (err) {
      log.fatal('Configuration: TLS is enabled but misconfigured (%s)', err);
      process.exit(1);
    }
  } else {
    server = require('http').Server(app);
  }

  return server;
};
