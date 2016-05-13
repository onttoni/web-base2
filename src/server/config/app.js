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
  cfg.http.tlsKey = '';
  cfg.http.tlsCert = '';
  cfg.http.publicDir = path.join(__dirname, '../../../build/public');

  cfg.session = {};
  cfg.session.secret = '';

  cfg.jsonwebtoken = {};
  cfg.jsonwebtoken.private = '';
  cfg.jsonwebtoken.public = '';
  cfg.jsonwebtoken.expiresIn = '24h';
  cfg.jsonwebtoken.sessionFallback = false;

  cfg.googleOAuth2 = {};
  cfg.googleOAuth2.enabled = true;
  cfg.googleOAuth2.clientId = '';
  cfg.googleOAuth2.clientSecret = '';
  cfg.googleOAuth2.callback = '/auth/callback-google';
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
