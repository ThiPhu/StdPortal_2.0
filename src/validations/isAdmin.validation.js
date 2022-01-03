const User = require('../models/User.model');

module.exports = async (req, res, next) => {
  const user = await User.find({}).lean();
  if (user) {
    if (req.user.role === 'admin') {
      return next();
    } else {
      return res.redirect('/');
    }
  } else {
    return res.redirect('/');
  }
};
