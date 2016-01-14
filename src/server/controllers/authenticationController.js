var expressJwt = require('express-jwt');
var jwtPublic = require('../token').getPublicKey();

function expressJwtFactory() {
  return expressJwt({
    secret: jwtPublic
  }),
  function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).send({msg: 'unauthorized'});
    }
    next();
  };
}

module.exports.controller = function(app, apiPrefix) {

  app.all(apiPrefix + 'friends/', expressJwtFactory());

  app.get(apiPrefix + 'users', expressJwtFactory());

  app.put(apiPrefix + 'users', expressJwtFactory());

};
