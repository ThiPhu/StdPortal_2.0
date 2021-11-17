const apiRouter = require('./api.routes');
const { userAuth } = require('../middlewares/auth.middleware');

const route = app => {
  // Các route api
  app.use('/api', apiRouter);

  // Các route không yêu cầu phiên đăng nhập của user

  app.get('/', (req, res) => res.redirect('/home'));

  app.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/login');
  });

  app.get('/login', (req, res) => {
    if (req.cookies.access_token) {
      return res.redirect('/home');
    }
    res.render('login');
  });

  app.get('/404', (req, res) => res.render('404'));

  // Kiểm tra token session
  app.use(userAuth);

  // Các route yêu cầu phiên đăng nhập của user
  app.get('/home', (req, res) => {
    res.render('home');
  });

  app.get('/management', (req, res) => {
    res.render('admin/management');
  });

  // app.use((req,res) => res.redirect("/404"))
};

module.exports = route;
