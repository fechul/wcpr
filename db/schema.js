var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    'email': String,
    'password': String,
    'lastName': String,
    'firstName': String,
    'sex': String,
    'birthYear': Number,
    'birthMonth': Number,
    'birthDate': Number,
    'phoneNumber': Number,
    'qualification': Number,
    'signupDate': Date
});

var user = mongoose.model('user', userSchema);

module.exports = {
  'user' : user
};
