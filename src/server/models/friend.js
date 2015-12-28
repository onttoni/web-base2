var mongoose = require('mongoose');
var schema = require('./friendSchema');

module.exports = mongoose.model('Friend', schema);
