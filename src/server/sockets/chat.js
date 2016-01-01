var _ = require('lodash');
var log = require('../logger');
var User = require('../models/user');

module.exports.events = function(socket) {

  'use strict';

  function findUser(userId, callback) {
    User.findOne({_id: userId}, callback);
  }

  function getOutput(user, msg) {
    return {
      time: Date.now(),
      userEmail: user.email,
      msg: msg
    };
  }

  function chat(data) {
    var event = _.get(data, 'event');
    var msg = _.get(data, 'msg');
    var output;
    if (msg) {
      output = getOutput(socket.decoded_token, msg);
    } else if (event) {
      output = getOutput(socket.decoded_token, event);
    } else {
      console.error('Chat could not recognize payload type.');
      return;
    }
    socket.emit('chat', output);
    socket.broadcast.emit('chat', output);
  }

  socket.addListener('chat', chat);

  socket.on('disconnect', function() {
    log.debug('Disconnecting socket.');
    socket.removeListener('chat', chat);
  });

};
