var fs = require('fs');
var ini = require('ini');
var path = require('path');

module.exports = function(configPath) {

  'use strict';

  if (!configPath) {
    return null;
  }
  // Just to throw an error if ini-file is not where its supposed to be.
  fs.statSync(configPath).isFile();
  var config = ini.parse(fs.readFileSync(configPath, 'utf-8'));

  return config;
};
