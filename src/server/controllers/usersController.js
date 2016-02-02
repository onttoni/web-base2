var base64url = require('base64url');
var crypto = require('crypto');
var _ = require('lodash');
var User = require('../models/user');
var AccessCode = require('../models/accessCode');
var getUserId = require('../token').getUserId;
var signUserToken = require('../token').signUserToken;

module.exports.controller = function(app, apiPrefix, passport) {

  'use strict';

  let path = apiPrefix + 'users/';

  app.post(path + 'signin-local', function(req, res, next) {
    localLogin(req, res, next, passport);
  });

  app.get(path + 'signin-google', function(req, res, next) {
    googleOAuth2Login(req, res, next, passport, {authUrl: true});
  });

  app.post(path + 'signup', function(req, res, next) {
    signUp(req, res, next, passport);
  });

  app.get(path + 'signout', function(req, res) {
    req.logout();
    return res.status(200).send({msg: 'ok'});
  });

  app.get('/auth/callback-google', function(req, res, next) {
    googleOAuth2Login(req, res, next, passport, {authUrl: false});
  });

  app.post(path + 'signin-access-code', function(req, res, next) {
    if (!_.has(req, 'body.code')) {
      return next();
    }
    AccessCode.findOne({
      code: req.body.code
    }).populate('user').exec(function(err, obj) {
      if (err) {
        return res.status(400).send({msg: 'bad request'});
      }
      if (!obj) {
        return res.status(404).send({msg: 'not found'});
      }
      let user = obj.user;
      obj.remove();
      return res.status(200).json({user: user, token: signUserToken(user)});
    });
  });

  app.get(path, function(req, res) {
    getUserId(req, function(id) {
      User.findOne({
        _id: id
      },
      function(err, obj) {
        if (err) {
          return res.status(400).send({msg: 'bad request'});
        }
        if (!obj) {
          return res.status(404).send({msg: 'not found'});
        }
        return res.json(obj);
      });
    });
  });

  app.put(path, function(req, res) {
    if (_.has(req.body, 'email')) {
      delete(req.body.email);
    }
    getUserId(req, function(id) {
      User.findOneAndUpdate({
        _id: id
      },
      req.body,
      {new: true, upsert: false},
      function(err, obj) {
        if (err) {
          return res.status(400).send({msg: 'bad request'});
        }
        if (!obj) {
          return res.status(404).send({msg: 'not found'});
        }
        return res.json(obj);
      });
    });
  });
};

function localLogin(req, res, next, passport) {
  passport.authenticate('local-login', function(err, user) {
    if (!user) {
      return res.status(404).send(err);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({user: user, token: signUserToken(user)});
    });
  })(req, res, next);
}

function googleOAuth2Login(req, res, next, passport, options) {

  'use strict';

  passport.authenticate('google-login', options, function(err, user, authUrl) {
    if (err) {
      return next(err);
    }
    if (authUrl) {
      return res.status(200).json({authUrl: authUrl});
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      let accessCode = new AccessCode({code: base64url(crypto.randomBytes(48)), user: user.id});
      accessCode.save();
      return res.redirect('/?access-code=' + accessCode.code);
    });
  }
  )(req, res, next);
}

function signUp(req, res, next, passport) {
  passport.authenticate('local-signup', function(err, user) {
    if (!user) {
      return res.status(404).send(err);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({user: user, token: signUserToken(user)});
    });
  })(req, res, next);
}
