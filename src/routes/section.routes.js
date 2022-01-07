const Router = require("express").Router()
const sectionController = require("../controllers/section.controller")

// Get section list
Router.get("/", sectionController.read)

module.exports = Router;