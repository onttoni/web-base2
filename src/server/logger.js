cfg = require('./config');
module.exports = require('bunyan').createLogger({name: 'server', level: cfg.logger.level});
