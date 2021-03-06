var log = require('./logger');
var fs = require('fs');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);

module.exports = function(mongooseConnection) {

  return expressSession({
    secret: readSessionSecret(),
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongooseConnection,
      touchAfter: 24 * 3600})
  });

};

function readSessionSecret() {
  var sessionSecret;
  try {
    sessionSecret = fs.readFileSync(appConfig.session.secret).toString('utf8').trim();
    log.info('Server is using secret for session');
  } catch (err) {
    sessionSecret = 'foobar';
    log.warn('Server is using nonsecret for session', err);
  }
  return sessionSecret.toString('utf8');
}
