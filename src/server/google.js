var _ = require('lodash');
var log = require('./logger');
var fs = require('fs');
var util = require('util');
var GoogleOAuth2 = require('googleapis').auth.OAuth2;
var GooglePlus = require('googleapis').plus('v1');

function Strategy(verifyCallback) {
  var google = readGoogleOptions();
  var oauth2Client = new GoogleOAuth2(google.clientId, google.clientSecret, google.redirectURL);
  this.authUrl = oauth2Client.generateAuthUrl({access_type: 'offline', scope: google.scopes});
  this.name = 'google-login';
  this._verify = verifyCallback;
}

function readGoogleOptions() {
  'use strict';
  let google = {};
  try {
    let config = appConfig;
    google.clientId = fs.readFileSync(config.googleOAuth2.clientId).toString('utf8').trim();
    google.clientSecret = fs.readFileSync(config.googleOAuth2.clientSecret).toString('utf8').trim();
    google.redirectURL =
      'https://' +  appConfig.http.hostName + ':' + appConfig.http.port + appConfig.googleOAuth2.callback;
    google.scopes = config.googleOAuth2.scopes;
  } catch (err) {
    log.fatal('Configuration: Google OAuth2 is enabled but misconfigured (%s)', err);
    process.exit(1);
  }
  return google;
}

Strategy.prototype.authenticate = function(req, options) {
  if (options.authUrl) {
    return this.success(null, this.authUrl);
  }
  var google = readGoogleOptions();
  var oauth2Client = new GoogleOAuth2(google.clientId, google.clientSecret, google.redirectURL);
  if (!_.has(req, 'query.code')) {
    return self.fail('No authorizationCode found');
  }
  var self = this;
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }
  oauth2Client.getToken(req.query.code, function(err, tokens) {
    if (err) {
      return self.fail('Getting Google access token failed: ' + err);
    }
    oauth2Client.setCredentials(tokens);
    GooglePlus.people.get({userId: 'me', auth: oauth2Client}, function(err, profile) {
      if (err) {
        return self.fail('Requesting Google user failed: ' + err);
      }
      if (!profile) {
        return self.fail('Finding Google user profile failed: ' + err);
      }
      self._verify(tokens, profile, verified);
    });
  });
};

module.exports = Strategy;
