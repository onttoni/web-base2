var path = require('path');

cfg = {};
module.exports = cfg;

cfg.express = {};
cfg.express.httpPort = 8080;
cfg.express.key = path.join(__dirname, 'keys/ssl_key.pem');
cfg.express.cert = path.join(__dirname, 'keys/ssl_cert.pem');

cfg.expressSession = {};
cfg.expressSession.secret = 'foobar';

cfg.jsonwebtoken = {};
cfg.jsonwebtoken.private = path.join(__dirname, 'keys/jwt_private_key.pem');
cfg.jsonwebtoken.public = path.join(__dirname, 'keys/jwt_public_key.pem');
cfg.jsonwebtoken.expiresIn = '24h';

cfg.mongo = {};
cfg.mongo.host = 'mongo01.local';
cfg.mongo.port = 27017;
cfg.mongo.db = 'people';
cfg.mongo.user = 'nodeusr';
cfg.mongo.password = 'nodepw';

cfg.logger = {};
cfg.logger.level = 'debug';
