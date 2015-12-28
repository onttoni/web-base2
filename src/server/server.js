var log = require('./logger');
var compression = require('compression');
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var mongooseConnection = require('./db').connect();
var passport = require('passport');
const apiPrefix = '/api/';
const httpPort = require('./config').express.httpPort;
const publicDir = path.join(__dirname, '../../build/public');

var session = expressSession({
  secret: require('./config').expressSession.secret,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongooseConnection,
    touchAfter: 24 * 3600})
});

try {
  var server = require('https').Server(
    {
      key: fs.readFileSync(require('./config').express.key),
      cert: fs.readFileSync(require('./config').express.cert)
    },
    app
  );
  log.info('Server enabled SSL');
} catch (err) {
  var server = require('http').Server(app);
  log.warn('Server disabled SSL', err);
}

require('./socket')(server);
require('./passport')(passport);

// All middleware should be placed before routes.
app.use(compression());
log.info('Serving static files from:', publicDir);
app.use(express.static(publicDir));
app.use(require('express-bunyan-logger')({
  parseUA: false,
  format: ':method :url :status-code'}));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(require('method-override')());

// Include routes
var ctrlDir = path.join(__dirname, 'controllers');
log.debug('Scanning', ctrlDir, 'for controllers.');
fs.readdirSync(ctrlDir).forEach(function(file) {
  if (path.extname(file) == '.js') {
    log.debug('Found', file);
    route = require(path.join(ctrlDir, file));
    route.controller(app, apiPrefix, passport);
  }
});

app.get('*', function(req, res) {
  res.sendFile('app/index.html', {root: publicDir});
});

server.listen(httpPort);
log.info('Server listening on port', httpPort);
