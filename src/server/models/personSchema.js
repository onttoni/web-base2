var mongoose = require('mongoose');
var util = require('util');

var validateEmail = function(email) {
  return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(email);
};

function PersonSchema() {
  mongoose.Schema.apply(this, arguments);

  this.add({
    provider: {type: String},
    name: {
      family: {type: String, required: true},
      given: {type: String, required: true},
      middle: {type: String},
    },
    email: {
      type: String,
      required: true,
      validate: [validateEmail, 'Please fill a valid email address.']
    },
    created: Date
  });

  this.virtual('name.formatted').get(function() {
    return this.name.given + ' ' + this.name.family;
  });
}

util.inherits(PersonSchema, mongoose.Schema);

module.exports = PersonSchema;
