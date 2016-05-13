var bunyan = require('bunyan');

var logger = bunyan.createLogger({
  name: 'server',
  streams: [
    appConfig.logger.path ? {
      type: 'rotating-file',
      path: appConfig.logger.path,
      level: appConfig.logger.level,
      period: '1d',
      count: 3
    } : {
      stream: process.stdout,
      level: appConfig.logger.level
    }
  ]
});

module.exports = logger;
