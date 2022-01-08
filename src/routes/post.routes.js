const Router = require('express').Router();
const multerhelper = require('../utils/multerhelper');
const postController = require('../controllers/post.controller');
const cloudinaryUpload = require('../utils/cloudinaryUpload');

const postValidation = require('../validations/post.validation');

// Lấy tất cả bài viết
Router.get('/', postController.getPosts);

// Lấy bài viết theo ID
Router.get('/:id', postController.getPostId);

// Lấy bài viết theo người dùng
// Router.get('/:uid', postController.getPostByUser)

// Tạo bài viết mới
Router.post(
  '/',
  cloudinaryUpload.single('image'),
  postValidation.image,
  postController.create
);

// Cập nhật lại bài viết
Router.put(
  '/:id',
  cloudinaryUpload.single('image'),
  postValidation.image,
  postController.update
);

// Xoá bài viết
Router.delete('/:id', postController.delete);

module.exports = Router;
