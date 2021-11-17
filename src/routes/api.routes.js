const Router = require('express').Router();
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');

// /api/auth
Router.use('/auth', authRouter);
// /api/user
Router.use('/user', userRouter);

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

module.exports = Router;
