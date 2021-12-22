const Router = require("express").Router()
const userController = require("../controllers/user.controller")
const userValidation = require("../validations/user.validation")

// get user 
Router.get("/", userController.read)

// Create new user
Router.post("/", userValidation ,userController.create )

module.exports = Router