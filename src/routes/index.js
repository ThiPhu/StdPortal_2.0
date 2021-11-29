const apiRouter = require('./api.routes');
const { userAuth } = require('../middlewares/auth.middleware');
const Users = require('../models/User.model');
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
      return res.redirect('/home');
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
    console.log(req.user.role);
    res.render('home', {
      user: req.user,
      admin: req.user.role === 'admin' ? true : false,
      exampleAvatar: '../../public/image/tdt.jpg',
    });
  });

  app.get('/profile/:user', async (req, res) => {
    const student = await Users.findOne({
      fullname: req.params.user,
    });
    const faculty = await Users.findOne({
      username: req.params.user,
    });
    res.render('users/profile', {
      user: req.user, // Current user logging in
      isProfilePage: true,
      currentProfile: student ? !faculty && student : faculty,
      admin: req.user.role === 'admin' ? true : false,
    });
  });

  app.get('/management', async (req, res) => {
    const studentRole = await Users.find({ role: 'student' }).lean();
    const facultyRole = await Users.find({ role: 'faculty' }).lean();
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
  // app.use((req,res) => res.redirect("/404"))
};

module.exports = route;
