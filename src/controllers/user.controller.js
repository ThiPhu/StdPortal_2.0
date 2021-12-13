const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Create user
exports.create = async (req, res, next) => {

  // Generate salt
  const salt = await bcrypt.genSalt();
  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Generate avatar
  

  try {
    const user = await User.create({
      username: req.body.email ? req.body.email.split("@")[0] : null ,
      email: req.body.email ? req.body.email : null,
      password: hashedPassword,
      role: req.body.role,
      unit: req.body.unit ? req.body.unit : null,
      topics: req.body.topics ? req.body.topics: null
    });
    return res.json({
      ok: true,
      msg: 'Tạo người dùng mới thành công!',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Update user
exports.update = async (req, res, next) => {
  
}

// exports.createFromGoogleAuth = async (req, res, next) =>{
//     passport.use(
//         new GoogleStrategy({
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: "/api/auth/google/callback"
//         }
//     )
// }
