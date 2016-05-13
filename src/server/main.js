var compression = require('compression');
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
require('./config/app')(process.argv[2]);
// Modules depending on global appConfig must be placed after config/app require.
var log = require('./logger');
var session = require('./session')();
var server = require('./server')(app);
require('./socket')(server);
require('./passport')(passport);
const apiPrefix = '/api/';
const publicDir = appConfig.http.publicDir;

// All middleware should be placed before routes.
app.use(compression());
log.info('Serving static files from:', publicDir);
app.use(express.static(publicDir));
app.use(require('bunyan-middleware')({
  headerName: 'X-Request-Id',
  propertyName: 'reqId',
  logName: 'req_id',
  obscureHeaders: [],
  logger: log
}));
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

server.listen(appConfig.http.port);
log.info('Server listening on port', appConfig.http.port);
