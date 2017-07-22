var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kprg_userSchema = new Schema({
    'email': String,
    'password': String,
    'lastName': String,
    'firstName': String,
    'sex': String,
    'birthYear': Number,
    'birthMonth': Number,
    'birthDate': Number,
    'phoneNumber': String,
    'qualification': Number,
    'signupDate': Date,
    'authed': Boolean,
    'token': String,
    'level': Number
});

var kprg_user = mongoose.model('kprg_user', kprg_userSchema);

module.exports = {
  'kprg_user' : kprg_user
};
