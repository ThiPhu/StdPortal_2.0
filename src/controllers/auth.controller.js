const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { genToken } = require('../utils/jwt.js');

exports.post = async (req, res, next) => {
  const { loginUsername, loginPassword } = req.body;
  try {
    const user = await User.findOne({ username: loginUsername }).lean();
    if (user) {
      const hashedPassword = user.password;
      if (bcrypt.compareSync(loginPassword, hashedPassword)) {
        console.log('From auth.controller: Đăng nhập từ User');
        return res
          .cookie('access_token', genToken({ id: user['_id'].toString() }), {
            httpOnly: true,
          })
          .json({
            ok: true,
            msg: 'Đăng nhập thành công!',
          });
      }
      return res.status(401).json({
        ok: false,
        msg: 'Tài khoản hoặc mật khẩu không đúng!',
        at: 'loginPassword',
      });
    }
    return res.status(401).json({
      ok: false,
      msg: 'Tài khoản hoặc mật khẩu không đúng!',
      at: 'loginUsername',
    });
  } catch (err) {
    next(err);
  }
};
