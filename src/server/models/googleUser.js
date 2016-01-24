var mongoose = require('mongoose');
var Schema = require('./googleUserSchema');

module.exports = mongoose.model('GoogleUser', new Schema());
