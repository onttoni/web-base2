var log = require('./logger');
var mongoose = require('mongoose');
var cfg = require('./config/base');
var dbUri = 'mongodb://' + cfg.mongo.user + ':' + cfg.mongo.password + '@' +
  cfg.mongo.host + ':' + cfg.mongo.port + '/' + cfg.mongo.db;

function connect() {
  log.info('Connecting MongoDB:', dbUri);
  mongoose.connect(dbUri, function(err) {
    if (err) {
      log.fatal('MongoDB connection failed', err);
      log.fatal('Bailing out');
      process.exit(1);
    } else {
      log.info('MongoDB connected');
    }
  });
  return mongoose.connection;
}

module.exports.connect = connect;
