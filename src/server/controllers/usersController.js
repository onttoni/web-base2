var _ = require('lodash');
var User = require('../models/user');
var getUserId = require('../token').getUserId;
var signUserToken = require('../token').signUserToken;

module.exports.controller = function(app, apiPrefix, passport) {

  var path = apiPrefix + 'users/';

  app.post(path, function(req, res, next) {
    if (req.query.login) {
      login(req, res, next, passport);
    } else if (req.query.signup) {
      signUp(req, res, next, passport);
    } else {
      return res.status(400).send({msg: 'bad request'});
    }
  });

  app.get(path, function(req, res) {
    if (req.query.logout) {
      req.logout();
      return res.status(200).send({msg: 'ok'});
    }
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

function login(req, res, next, passport) {
  passport.authenticate('local-login', function(err, user) {
    if (!user) {
      return res.status(404).send(err);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json({user: user, token: signUserToken(user)});
    });
  })(req, res, next);
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
      return res.json({user: user, token: signUserToken(user)});
    });
  })(req, res, next);
}
