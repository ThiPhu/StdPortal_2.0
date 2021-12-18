// Kiểm tra session sử dụng token
const mongoose = require('mongoose');
const User = require('../models/User.model');
const { genToken, verifyToken } = require('../utils/jwt');

exports.userAuth = async (req, res, next) => {
  const { access_token } = req.cookies;
  try {
    if (access_token) {
      const { id } = verifyToken(access_token);
      if (id && mongoose.isValidObjectId(id)) {
        const user = await User.findById(id);
        if (user) {
          req.user = user;
          res.cookie('access_token', genToken({ id }));
          return next();
        }
      }
    }
    return res.redirect('/login');
  } catch (err) {
    // Chuyển về trang đăng nhập nếu không tồn tại session token
    console.log('From auth.middleware:', err);
    return res
      .clearCookie('access_token')
      .json({ ok: false, message: 'Phiên đăng nhập không hợp lệ' })
      .redirect('/login');
  }
};
