const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //plugin used to check unique values

//schema defination
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

//model
module.exports = mongoose.model('User', userSchema);
