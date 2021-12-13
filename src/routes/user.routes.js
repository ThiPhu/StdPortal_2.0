const Router = require("express").Router()
const userController = require("../controllers/user.controller")
const userValidation = require("../validations/user.validation")
// Create new user
Router.post("/", userValidation ,userController.create )

module.exports = Router