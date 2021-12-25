const apiRouter = require('./api.routes');
const { userAuth } = require('../middlewares/auth.middleware');
const authRouter = require('./auth.routes');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const {verifyToken} = require('../utils/jwt');
const mongoose = require('mongoose');

const route = app => {
  // Các route không yêu cầu phiên đăng nhập của user
  // /api/auth
  app.use('/api/auth', authRouter);

  app.get('/', (req, res) => {
    res.redirect('/home');
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/login');
  });

  app.get('/login', (req, res) => {
    // Nếu tồn tại token đăng nhập, bay thẳng vào nhà
    if (req.cookies.access_token) {
      return res.redirect('/home');
    }
    res.render('login');
  });

  // Kiểm tra token session
  app.use(userAuth);

  // Các route yêu cầu phiên đăng nhập của user

  app.get('/home', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).lean(); // Lấy hết tất cả các post
    const date = new Date();
    console.log('From index.routes: Role đang đăng nhập:', req.user.role);
    console.log('From index.routes: ID đang đăng nhập:', req.user.id);
    res.render('home', {
      user: req.user,
      post: posts,
      admin: req.user.role === 'admin' ? true : false,
    });
  });

  // Các route api
  app.use('/api', apiRouter);

  app.get('/profile/:user', async (req, res) => {
    const student = await User.findOne({
      fullname: req.params.user,
    });
    const faculty = await User.findOne({
      username: req.params.user,
    });

    // Check is owner by check validate token
    const {access_token} = req.cookies
    let isOwner = false;

    const {id} = verifyToken(access_token)
    console.log("TOKEN ID",id)

    if(id && mongoose.isValidObjectId(id)){
      if(id == req.user._id.toString()){
        isOwner = true;
      }
    }

    console.log(mongoose.isValidObjectId(id))

    console.log(id == req.user._id.toString())

    console.log("USER INFO",req.user)

    console.log("USER ID", req.user._id.toString())

    console.log("IS OWNER", isOwner)

    res.render('user/profile', {
      user: req.user, // Current user logging in
      isProfilePage: true,
      isOwner: isOwner,
      currentProfile: student ? !faculty && student : faculty,
      admin: req.user.role === 'admin' ? true : false,
    });
  });

  app.get('/management', async (req, res) => {
    const studentRole = await User.find({ role: 'student' }).lean();
    const facultyRole = await User.find({ role: 'faculty' }).lean();
    if (req.user.role === 'admin') {
      return res.render('admin/management', {
        // Check for role
        admin: req.user.role === 'admin' ? true : false,
        user: req.user, // For showing who is logging in session
        student: studentRole, // Show all of Student from database for admin to manage
        faculty: facultyRole, // Show all of Faculty from database for admin to manage
        exampleAvatar: '../../public/image/tdt.jpg',
      });
    }
    return res.redirect('/home');
  });



  app.get('*', (req, res) => {
    res.status(404).render('error');
  });

  // Handle error nếu không decode được params
  app.use((err, req, res, next) => {
    try {
      decodeURIComponent(req.path);
    } catch (e) {
      err = e;
    }
    if (err) {
      console.log('From index.routes: Error', err);
      return res.redirect('/error');
    }
    next();
  });
};

module.exports = route;
