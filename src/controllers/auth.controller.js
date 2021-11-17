const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { genToken } = require('../utils/jwt.js');

exports.post = async (req, res, next) => {
  const { loginUserName, loginPassword } = req.body;

  try {
    const user = await User.findOne({ username: loginUserName }).lean();
    if (user) {
      const hashedPassword = user.password;
      if (bcrypt.compareSync(loginPassword, hashedPassword)) {
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
        msg: 'Mật khẩu không đúng!',
      });
    }
    return res.status(401).json({
      ok: false,
      msg: 'Tài khoản không tồn tại!',
    });
  } catch (err) {
    next(err);
  }
};