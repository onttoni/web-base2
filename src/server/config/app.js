var path = require('path');
var _ = require('lodash');

module.exports = function(configPath) {

  'use strict';

  var cfg = {};
  let cfgOverrides;

  /**
   * Configuration defaults below. You can pass path
   * to configuration file when running main.js. Matching
   * configuration options read from the file will
   * be used to override these values.
   */

  cfg.http = {};
  cfg.http.hostName = 'localhost';
  cfg.http.port = 8080;
  cfg.http.tlsKey = path.join(__dirname, '../keys/tls_key.pem');
  cfg.http.tlsCert = path.join(__dirname, '../keys/tls_cert.pem');

  cfg.expressSession = {};
  cfg.expressSession.secret = path.join(__dirname, '../keys/session-secret.key');

  cfg.jsonwebtoken = {};
  cfg.jsonwebtoken.private = path.join(__dirname, '../keys/jwt_private_key.pem');
  cfg.jsonwebtoken.public = path.join(__dirname, '../keys/jwt_public_key.pem');
  cfg.jsonwebtoken.expiresIn = '24h';
  cfg.jsonwebtoken.sessionFallback = false;

  cfg.googleOAuth2 = {};
  cfg.googleOAuth2.enabled = true;
  cfg.googleOAuth2.clientId = path.join(__dirname, '../keys/google-client-id.key');
  cfg.googleOAuth2.clientSecret = path.join(__dirname, '../keys/google-client-secret.key');
  cfg.googleOAuth2.callback = '/auth/callback-google';
  cfg.googleOAuth2.redirectURL =
    'https://' +  cfg.http.hostName + ':' + cfg.http.port + cfg.googleOAuth2.callback;
  cfg.googleOAuth2.scopes = ['email', 'profile'];

  cfg.database = {};
  cfg.database.host = 'localhost';
  cfg.database.port = 27017;

  cfg.logger = {};
  cfg.logger.level = 'info';

  cfgOverrides = require('./overrides')(configPath);
  if (cfgOverrides) {
    _.merge(cfg, cfgOverrides);
  }

  global.appConfig = cfg;
};
