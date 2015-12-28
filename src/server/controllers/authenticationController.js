var expressJwt = require('express-jwt');
var jwtPublic = require('../token').getPublicKey();

module.exports.controller = function(app, apiPrefix) {

  app.all(apiPrefix + 'friends/',
  expressJwt({
    secret: jwtPublic
  }),
  function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).send({msg: 'unauthorized'});
    }
    next();
  });
};
