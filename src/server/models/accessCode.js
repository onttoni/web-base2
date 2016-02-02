var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  code: {index: true, required: true, type: String},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});
var AccessCode = mongoose.model('AccessCode', schema);

module.exports = AccessCode;
