var fs = require('fs');
var path = require('path');
var log = require('./logger');
var socketioJwt = require('socketio-jwt');
var jwtPublic = require('./token').getPublicKey();

module.exports = function(server) {

  'use strict';

  var socketIo = require('socket.io');
  var io = socketIo.listen(server);

  io.on('connection', socketioJwt.authorize({
    secret: jwtPublic,
    timeout: 10000,
    required: true
  }));
  io.on('authenticated', function(socket) {
    log.debug('Socket authenticated.');

    var sckDir = path.join(__dirname, 'sockets');
    log.debug('Scanning', sckDir, 'for socket event handlers.');
    fs.readdirSync(sckDir).forEach(function(file) {
      if (path.extname(file) == '.js') {
        log.debug('Found', file);
        require(path.join(sckDir, file)).events(socket);
      }
    });

  });

};
