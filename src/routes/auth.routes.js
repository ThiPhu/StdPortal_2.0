const Router = require("express").Router()
const authController = require('../controllers/auth.controller')
const authValidation = require('../validations/auth.validation')

const passport = require("passport")


Router.post("/", authValidation, authController.post)

// GG Oauth 2.0
Router.get("/google", passport.authenticate('google', 
    {
        scope: ['profile', 'email']
    })
)

// get callback
Router.get("/google/callback", 
    passport.authenticate('google'),
)

module.exports = Router