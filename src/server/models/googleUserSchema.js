var mongoose = require('mongoose');
var util = require('util');

function GoogleTokenSchema() {
  mongoose.Schema.apply(this, arguments);

  this.add({
    type: {type: String},
    access_token: {type: String},
    id_token: {type: String},
    expiry_date: {type: Date}
  });
}
util.inherits(GoogleTokenSchema, mongoose.Schema);

function GoogleEmailSchema() {
  mongoose.Schema.apply(this, arguments);

  this.add({
    value: {type: String},
    type: {type: String}
  });
}
util.inherits(GoogleEmailSchema, mongoose.Schema);

function GooglePlacesLivedSchema() {
  mongoose.Schema.apply(this, arguments);

  this.add({
    value: {type: String}
  });
}
util.inherits(GooglePlacesLivedSchema, mongoose.Schema);

function GoogleProfileSchema() {
  mongoose.Schema.apply(this, arguments);

  this.add({
    kind: {type: String},
    etag: {type: String},
    gender: {type: String},
    emails: [new GoogleEmailSchema()],
    objectType: {type: String},
    id: {type: String, unique: true, sparse: true},
    displayName: {type: String},
    name: {
      familyName: {type: String},
      givenName: {type: String}
    },
    url: {type: String},
    image: {
      url: {type: String},
      isDefault: {type: Boolean}
    },
    placesLived: [new GooglePlacesLivedSchema()],
    isPlusUser: {type: Boolean},
    language: {type: String},
    circledByCount: {type: Number},
    verified: {type: Boolean},
  });
}
util.inherits(GoogleProfileSchema, mongoose.Schema);

function GoogleUserSchema() {
  mongoose.Schema.apply(this, arguments);

  this.add({
    tokens: new GoogleTokenSchema(),
    profile: new GoogleProfileSchema(),
    created: Date
  });
}
util.inherits(GoogleUserSchema, mongoose.Schema);

module.exports = GoogleUserSchema;
