const mongoose = require('mongoose');

// Defining schema
let Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: {
    type: String,
    default: null,
  },
  fullname: {
    type: String,
    default: null,
  },
  password: String,
  avatar: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: 'student',
  },
  class: {
    type: String,
    default: null,
  },
  unit: 
    {type: Schema.Types.ObjectId, ref: 'Sections'},
  
  topics: {
    type: [{type: Schema.Types.ObjectId, ref: 'Sections'}],
    default: null
  },
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;
