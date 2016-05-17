var fs = require('fs');
var util = require('util');
var bunyan = require('bunyan');
const Writable = require('stream').Writable;

function LogFileStream(opts) {
  Writable.call(this, opts);
  this._buffer = [];
  this._fd = fs.openSync(opts, 'a');
}
util.inherits(LogFileStream, Writable);

LogFileStream.prototype.sync = function() {
  var fd = this._fd;
  var i = this._buffer.length;
  while (i--) {
    fs.writeFileSync(fd, this._buffer.shift());
  }
};

LogFileStream.prototype._write = function(chunk, encoding, callback) {
  this._buffer.push(chunk);
  process.nextTick(() => {
    fs.writeFile(this._fd, this._buffer.shift());
  });
  if (callback) {
    callback();
  }
};

var stream;
if (appConfig.logger.path) {
  stream = new LogFileStream(appConfig.logger.path);
} else {
  stream = process.stdout;
}

var logger = bunyan.createLogger({
  name: 'server',
  level: appConfig.logger.level,
  stream: stream
});

logger.flush = function() {
  this.streams.forEach(function(stream) {
    if (stream.stream instanceof LogFileStream) {
      stream.stream.sync();
    }
  });
};

module.exports = logger;
