const Router = require('express').Router();
const userController = require('../controllers/user.controller');

// Tạo user mới
Router.post('/', userController.create);

// Lấy user theo ID (Xem trang cá nhân)
Router.get('/:user', userController.getUserDetail);

// Lấy hết tất cả user (quản lý của admin)
Router.get('/', userController.get);

module.exports = Router;
