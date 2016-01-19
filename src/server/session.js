var log = require('./logger');
var fs = require('fs');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var mongooseConnection = require('./db').connect();
var sessionSecret = 'foobar';

readSessionSecret();

module.exports = function() {

  return expressSession({
    secret: sessionSecret,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongooseConnection,
      touchAfter: 24 * 3600})
  });

};

function readSessionSecret() {
  try {
    sessionSecret = fs.readFileSync(require('./config').expressSession.secret);
    log.info('Server is using secret for session');
  } catch (err) {
    log.warn('Server is using nonsecret for session', err);
  }
}
