var moment = require('moment');
var log = require('../logger');
var User = require('../models/user');

module.exports.events = function(socket) {

  'use strict';

  function findUser(userId, callback) {
    User.findOne({_id: userId}, callback);
  }

  function getOutput(user, msg) {
    return {
      time: moment(),
      userEmail: user.email,
      msg: msg
    };
  }

  socket.on('chat:join', function() {
    var output = getOutput(socket.decoded_token, 'joined');
    socket.emit('chat:hello', output);
    socket.broadcast.emit('chat:say', output);
  });

  socket.on('chat:msg', function(data) {
    var output = getOutput(socket.decoded_token, data);
    socket.emit('chat:say', output);
    socket.broadcast.emit('chat:say', output);
  });

  socket.on('chat:leave', function() {
    var output = getOutput(socket.decoded_token, 'left');
    socket.emit('chat:bye', output);
    socket.broadcast.emit('chat:say', output);
  });

};
