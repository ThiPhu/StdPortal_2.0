const Router = require("express").Router()
const authController = require('../controllers/auth.controller')
const authValidation = require('../validations/auth.validation')


Router.post("/", authValidation, authController.create)

module.exports = Router