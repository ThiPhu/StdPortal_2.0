const Router = require("express").Router()
const userController = require("../controllers/user.controller")
const userValidation = require("../validations/user.validation")

// Get user 
Router.get("/", userController.read)

// Get user detail
Router.get("/:userId", userController.readDetail)

// Lấy user theo ID (Xem trang cá nhân)
// Router.get('/:user', userController.getUserDetail);

// Lấy hết tất cả user (quản lý của admin)
// Router.get('/', userController.get);

// Create new user
Router.post('/', userValidation.create, userController.create);

// Update user
Router.put("/:userId", userValidation.update, userController.update)

// Delete user
Router.delete("/:userId", userController.delete)

module.exports = Router
