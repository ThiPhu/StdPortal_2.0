const apiRouter = require('./api.routes');
const { userAuth } = require('../middlewares/auth.middleware');
const authRouter = require('./auth.routes');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

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
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean(); // Lấy hết tất cả các post
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
      console.log('From index.routes: Error', req.url);
      return res.redirect('/error');
    }
    next();
  });
};

module.exports = route;
