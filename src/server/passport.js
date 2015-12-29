var LocalStrategy   = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
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
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
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
  }));
};
