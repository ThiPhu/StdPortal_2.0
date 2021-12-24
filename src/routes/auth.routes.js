const Router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const { genToken } = require('../utils/jwt');

const passport = require('passport');
const { session } = require('passport');

Router.post('/', authValidation, authController.post);

// GG Oauth 2.0
Router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// get callback
Router.get('/google/callback', function (req, res, next) {
  passport.authenticate('google', function (err, user, message) {
    console.log('From auth.routes: Đăng nhập từ Google');
    // Database error
    if (err) {
      return next(err);
    }
    // User not found
    if (!user) {
      // res.render("login",{error: message})
      // Initiate error session
      req.session.error = message;
      return res.redirect('/login');
    }
    if (user) {
      return res
        .cookie('access_token', genToken({ id: user['_id'].toString() }), {
          httpOnly: true,
        })
        .redirect('/home');
    }
  })(req, res, next);
});

module.exports = Router;
