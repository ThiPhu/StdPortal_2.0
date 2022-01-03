const Router = require("express").Router();
const profileController = require("../controllers/profile.controller")
const profileValidation = require("../validations/profile.validation")


Router.get('/:userId', profileController.get);

Router.post('/:userId', profileValidation.update, profileController.update);

Router.get('/:userId/update-info', (req,res) => {
    return res.render("user/updateInfo",{
        user: req.user,
        isStudent: req.user.role === "student" ? true : false,
    })
});


module.exports = Router;