const Router = require("express").Router()
const userController = require("../controllers/user.controller")
const userValidation = require("../validations/user.validation")

// Get user 
Router.get("/", userController.read)

// Get user detail
Router.get("/:userId", userController.readDetail)

// Create new user
Router.post("/", userValidation ,userController.create )

// Update user
Router.put("/:userId", userController.update)

// Delete user
Router.delete("/:userId", userController.delete)

module.exports = Router