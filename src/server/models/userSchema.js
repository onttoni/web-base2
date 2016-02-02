var bcrypt   = require('bcrypt-nodejs');
var PersonSchema = require('./personSchema');
var GoogleUserSchema = require('./googleUserSchema');

var UserSchema = new PersonSchema({
  google: new GoogleUserSchema(),
  password: {type: String}
},
{
  toObject: {getters: true, virtuals: true},
  toJSON: {getters: true, virtuals: true}
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.displayFields = function() {
  return ['name.given', 'name.family', 'email', 'password'];
};

module.exports = UserSchema;
