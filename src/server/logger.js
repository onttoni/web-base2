cfg = require('./config/base');
module.exports = require('bunyan').createLogger({name: 'server', level: cfg.logger.level});
