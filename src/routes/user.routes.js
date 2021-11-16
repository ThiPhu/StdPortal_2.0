const Router = require("express").Router()
const userController = require("../controllers/user.controller")

// Create new user
Router.post("/", userController.create )

module.exports = Router