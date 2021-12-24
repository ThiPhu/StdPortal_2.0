const Router = require('express').Router();
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');

// Lấy user theo ID (Xem trang cá nhân)
Router.get('/:user', userController.getUserDetail);

// Create new user
Router.post('/', userValidation, userController.create);

module.exports = Router;
