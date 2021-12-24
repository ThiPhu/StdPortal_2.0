const Router = require('express').Router();
const userRouter = require('./user.routes');
const sectionRouter = require('./section.routes');
const { userAuth } = require('../middlewares/auth.middleware');
const authRouter = require('./auth.routes')

// /api/auth
Router.use('/auth', authRouter);

// Kiem tra token session
Router.use(userAuth);

// /api/user
Router.use('/user', userRouter);

// /api/section
Router.use('/section', sectionRouter)

Router.use((req, res) =>
  res.status(404).json({
    ok: false,
    msg: 'Không thể giải quyết yêu cầu!',
  })
);

// Handle error
Router.use((err, req, res) => {
  console.log(err);
  return res.status(500).json({
    ok: false,
    msg: 'Đã có lỗi xảy ra!',
  });
});
const postRouter = require('./post.routes');

// /api/user
Router.use('/user', userRouter);
// /api/post
Router.use('/post', postRouter);

module.exports = Router;
