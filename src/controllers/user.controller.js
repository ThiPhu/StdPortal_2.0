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
    if (!student && !faculty) return res.status(404).render('error');
    if (req.params.user !== 'admin') return res.status(404).render('error');
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

// Get all user (for admin)
exports.get = async (req, res, next) => {
  try {
    const studentRole = await User.find({ role: 'student' }).lean();
    const facultyRole = await User.find({ role: 'faculty' }).lean();
    if (req.user.role === 'admin') {
      return res.render('admin/management', {
        user: req.user, // For showing who is logging in session
        student: studentRole, // Show all of Student from database for admin to manage
        faculty: facultyRole, // Show all of Faculty from database for admin to manage
        exampleAvatar: '../../public/image/tdt.jpg',
      });
    }
    res.redirect('/home');
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
