const User = require('../models/User.model');
const bcrypt = require('bcrypt');

// Get user ID (profile)
exports.getUserDetail = async (req, res, next) => {
  console.log('From user.controller: Trang cá nhân của ', req.params);
  try {
    const student = await User.findOne({
      fullname: req.params.user,
    });
    const faculty = await User.findOne({
      username: req.params.user,
    });

    // Nếu truy cập vào xem trang cá nhân của admin thì sẽ quay về home
    if (req.user.role !== 'admin') {
      if (req.params.user === 'admin') return res.redirect('/');
    }

    res.render('users/profile', {
      user: req.user, // Current user logging in
      isUserAvatar: '../' + req.user,
      isProfilePage: true,
      currentProfile: student ? !faculty && student : faculty,
      admin: req.user.role === 'admin' ? true : false,
    });
  } catch (err) {
    next(err);
  }
};

// Create user
exports.create = async (req, res, next) => {
  // Generate salt
  const salt = await bcrypt.genSalt();
  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const user = await User.create({
      username: req.body.email ? req.body.email.split('@')[0] : null,
      email: req.body.email ? req.body.email : null,
      password: hashedPassword,
      role: req.body.role,
      unit: req.body.unit ? req.body.unit : null,
      topics: req.body.topics ? req.body.topics : null,
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
exports.update = async (req, res, next) => {};

// exports.createFromGoogleAuth = async (req, res, next) =>{
//     passport.use(
//         new GoogleStrategy({
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: "/api/auth/google/callback"
//         }
//     )
// }
