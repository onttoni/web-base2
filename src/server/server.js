var log = require('./logger');
var fs = require('fs');

module.exports = function(app) {

  var server;

  try {
    server = require('https').Server(
      {
        key: fs.readFileSync(require('./config').express.key),
        cert: fs.readFileSync(require('./config').express.cert)
      },
      app
    );
    log.info('Server enabled SSL');
  } catch (err) {
    server = require('http').Server(app);
    log.warn('Server disabled SSL', err);
  }

  return server;
};
