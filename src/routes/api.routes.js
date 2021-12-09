const Router = require('express').Router();
const userRouter = require('./user.routes');
const postRouter = require('./post.routes');

// /api/user
Router.use('/user', userRouter);
// /api/post
Router.use('/post', postRouter);

module.exports = Router;
