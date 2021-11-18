const apiRouter = require('./api.routes');
const { userAuth } = require('../middlewares/auth.middleware');

const route = app => {
  // Các route api
  app.use('/api', apiRouter);

  // Các route không yêu cầu phiên đăng nhập của user

  app.get('/', (req, res) => {
    return res.redirect('/home');
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/login');
  });

  app.get('/login', (req, res) => {
    // Nếu tồn tại token đăng nhập, bay thẳng vào nhà
    if (req.cookies.access_token) {
      return res.status(200).render('home');
    }
    console.log('EROR', req.session.error);
    res.render('login', { msg: req.session.error });
    req.session.destroy();
  });

  app.get('/404', (req, res) => res.render('404'));

  // Kiểm tra token session
  app.use(userAuth);

  // Các route yêu cầu phiên đăng nhập của user
  app.get('/home', (req, res) => {
    res.render('home');
  });

  // app.use((req,res) => res.redirect("/404"))
};

module.exports = route;
