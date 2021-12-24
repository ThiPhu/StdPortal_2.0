const Router = require('express').Router();
const multerhelper = require('../utils/multerhelper');
const postController = require('../controllers/post.controller');

// Lấy tất cả bài viết
Router.get('/', postController.getPosts);

// Lấy bài viết theo ID
Router.get('/:id', postController.getPostId);

// Tạo bài viết mới
Router.post('/', multerhelper, postController.create);

// Cập nhật lại bài viết
Router.put('/:id', multerhelper, postController.update);

// Xoá bài viết
Router.delete('/:id', postController.delete);

module.exports = Router;
