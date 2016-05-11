var log = require('./logger');
var fs = require('fs');

module.exports = function(app) {

  var server;

  try {
    server = require('https').Server(
      {
        key: fs.readFileSync(appConfig.http.tlsKey),
        cert: fs.readFileSync(appConfig.http.tlsCert)
      },
      app
    );
    log.info('Server enabled TLS');
  } catch (err) {
    server = require('http').Server(app);
    log.warn('Server disabled TLS', err);
  }

  return server;
};
