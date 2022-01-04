const apiRouter = require('./api.routes');
const { userAuth } = require('../middlewares/auth.middleware');
const isAdmin = require('../validations/isAdmin.validation');
const authRouter = require('./auth.routes');
const profileRouter = require('./profile.routes')
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const {verifyToken} = require('../utils/jwt');
const mongoose = require('mongoose');
const Announcement = require('../models/Announcement.model');

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
    console.log("error",req.session.error)
    res.render('login',{msg: req.session.error});
  });

  // Kiểm tra token session
  app.use(userAuth);

  // Các route yêu cầu phiên đăng nhập của user

  app.get('/home', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).lean(); // Lấy hết tất cả các post
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .lean();
    console.log('From index.routes: Role đang đăng nhập:', req.user.role);
    console.log('From index.routes: ID đang đăng nhập:', req.user.id);
    res.render('home', {
      user: req.user,
      post: posts,
      admin: req.user.role === 'admin' ? true : false,
      currentProfile: req.user,
      announcements: announcements,
    });
  });

  app.use("/profile", profileRouter)

  //  ADMIN
  app.get('/management', async (req, res) => {
    const studentRole = await User.find({ role: 'student' }).lean();
    const facultyRole = await User.find({ role: 'faculty' }).lean();
    if (req.user.role === 'admin') {
      return res.render('admin/management', {
        // Check for role
        admin: req.user.role === 'admin' ? true : false,
        currentProfile: req.user, // For showing who is logging in session
        student: studentRole, // Show all of Student from database for admin to manage
        faculty: facultyRole, // Show all of Faculty from database for admin to manage
        exampleAvatar: '../../public/image/tdt.jpg',
      });
    }
    return res.redirect('/home');

    });
  app.get('/announcements', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).lean(); // Lấy hết tất cả các post
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .lean();
    res.render('home', {
      currentProfile: req.user,
      user: req.user,
      post: posts,
      isAnnoucePages: true,
      faculty: req.user.role === 'faculty' ? true : false,
      admin: req.user.role === 'admin' ? true : false,
      announcements: announcements,
    });
  });

  app.get('/announcement/:announceId', async (req, res) => {
    const announce = await Announcement.findById(req.params.announceId);
    res.render('announces/announcements', {
      user: req.user,
      faculty: req.user.role === 'faculty' ? true : false,
      admin: req.user.role === 'admin' ? true : false,
      announce: announce,
    });
  });

  app.get('/manage', isAdmin, async (req, res) => {
    try {
      const studentRole = await User.find({ role: 'student' }).lean();
      const facultyRole = await User.find({ role: 'faculty' }).lean();
      if (req.user.role === 'admin') {
        return res.render('admin/management', {
          currentProfile: req.user, // For showing who is logging in session
          student: studentRole, // Show all of Student from database for admin to manage
          faculty: facultyRole, // Show all of Faculty from database for admin to manage
          exampleAvatar: '../../public/image/tdt.jpg',
        });
      }
      res.redirect('/home');
    } catch (err) {
      next(err);
    }
  });

  // Các route api
  app.use('/api', apiRouter);


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
