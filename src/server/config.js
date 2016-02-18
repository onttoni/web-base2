var path = require('path');
var _ = require('lodash');

var cfg = {};
module.exports = cfg;

cfg.express = {};
cfg.express.hostName = 'localhost';
cfg.express.httpPort = 8080;
cfg.express.key = path.join(__dirname, 'keys/ssl_key.pem');
cfg.express.cert = path.join(__dirname, 'keys/ssl_cert.pem');

cfg.expressSession = {};
cfg.expressSession.secret = path.join(__dirname, 'keys/session-secret.key');

cfg.jsonwebtoken = {};
cfg.jsonwebtoken.private = path.join(__dirname, 'keys/jwt_private_key.pem');
cfg.jsonwebtoken.public = path.join(__dirname, 'keys/jwt_public_key.pem');
cfg.jsonwebtoken.expiresIn = '24h';
cfg.jsonwebtoken.sessionFallback = false;

cfg.googleOAuth2 = {};
cfg.googleOAuth2.enabled = true;
cfg.googleOAuth2.clientId = path.join(__dirname, 'keys/google-client-id.key');
cfg.googleOAuth2.clientSecret = path.join(__dirname, 'keys/google-client-secret.key');
cfg.googleOAuth2.callback = '/auth/callback-google';
cfg.googleOAuth2.redirectURL =
  'https://' +  cfg.express.hostName + ':' + cfg.express.httpPort + cfg.googleOAuth2.callback;
cfg.googleOAuth2.scopes = ['email', 'profile'];

cfg.mongo = {};
cfg.mongo.host = 'mongo01.local';
cfg.mongo.port = 27017;
cfg.mongo.db = 'people';
cfg.mongo.user = 'nodeusr';
cfg.mongo.password = 'nodepw';

cfg.logger = {};
cfg.logger.level = 'debug';

try {
  var cfgOverrides = require('./configOverrides');
} catch (err) {
}
if (cfgOverrides) {
  _.merge(cfg, cfgOverrides);
}
