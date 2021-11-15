const mongoose = require('mongoose');

// Defining schema
let Schema = mongoose.Schema;

const UserSchema = new Schema({
  avatar: String,
  googleId: String,
  username: String,
  email: String,
  password: String,
  role: Object,
  topics: [Object],
  class: String,
  faculty: String,
});

module.exports = mongoose.model('Users', UserSchema);
