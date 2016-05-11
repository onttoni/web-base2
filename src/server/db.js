var log = require('./logger');
var mongoose = require('mongoose');
var dbUri = 'mongodb://' + appConfig.database.user + ':' + appConfig.database.password + '@' +
  appConfig.database.host + ':' + appConfig.database.port + '/' + appConfig.database.db;

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
