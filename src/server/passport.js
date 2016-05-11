var _ = require('lodash');
var log = require('./logger');
var fs = require('fs');
var util = require('util');
var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy = require('./google');
var User = require('./models/user');
var GoogleUser = require('./models/googleUser');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      localSignup
    )
  );

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false
      },
      localVerify
    )
  );

  if (appConfig.googleOAuth2.enabled === true) {
    passport.use(
      'google-login',
      new GoogleStrategy(GoogleVerify)
    );
  }
}; // exports

function localVerify(email, password, done) {
  User.findOne({'email': email}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (!user) {
      return done({msg: 'not found'}, false);
    }
    if (!user.validPassword(password)) {
      return done({msg: 'invalid password'}, false);
    }
    return done(null, user);
  });
}

function localSignup(req, email, password, done) {
  process.nextTick(function() {
    User.findOne({'email': email}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done({msg: 'email is taken already'}, false);
      } else {
        var newUser = new User();
        newUser.email = email;
        newUser.name.given = req.body.name.given;
        newUser.name.family = req.body.name.family;
        newUser.password = newUser.generateHash(password);
        newUser.save(function(err) {
          if (err) {
            log.error('Creating new local user failed', err);
            throw err;
          }
          return done(null, newUser);
        });
      }
    });
  });
}

function GoogleVerify(tokens, profile, done) {
  var msg;
  if (!_.has(profile, 'id')) {
    msg = 'no user id found in profile';
    return done({msg: msg}, false);
  }
  if (!_.has(tokens, 'id_token')) {
    msg = 'no user id_token found';
    return done({msg: msg}, false);
  }
  if (!_.has(tokens, 'access_token')) {
    msg = 'no user access_token found';
    return done({msg: msg}, false);
  }
  User.findOne({'google.profile.id': profile.id}, function(err, user) {
    var msg;
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    var email = _.result(_.find(profile.emails, 'type', 'account'), 'value');
    if (!email) {
      msg = 'no user email found';
      return done({msg: msg}, false);
    }
    var givenName = _.get(profile, 'name.givenName');
    if (!givenName) {
      msg = 'no user givenName found';
      return done({msg: msg}, false);
    }
    var familyName = _.get(profile, 'name.familyName');
    if (!familyName) {
      msg = 'no user familyName found';
      log.error(msg);
      return done({msg: msg}, false);
    }
    var newUser = new User();
    newUser.google = new GoogleUser();
    newUser.google.tokens = tokens;
    newUser.google.profile = profile;
    newUser.email = email;
    newUser.name.given = givenName;
    newUser.name.family = familyName;
    newUser.save(function(err) {
      if (err) {
        var msg = 'creating new User failed ' + err;
        log.error(msg);
        return done({msg: msg}, false);
      }
      return done(null, newUser);
    });
  });
}
