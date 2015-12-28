var mongoose = require('mongoose');
var schema = require('./userSchema');

module.exports = mongoose.model('User', schema);
