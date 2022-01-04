const Router = require("express").Router();
const profileController = require("../controllers/profile.controller")
const profileValidation = require("../validations/profile.validation")
const multerhelper = require('../utils/multerhelper');
const cloudinaryUpload = require('../utils/cloudinaryUpload')

Router.get('/:userId', profileController.get);

Router.post('/faculty/:userId', profileValidation.update, profileController.updateFaculty);

Router.post('/student/:userId', cloudinaryUpload.single("image"), profileValidation.update, profileController.updateStudent);

Router.get('/:userId/update-info', (req,res) => {
    return res.render("user/updateInfo",{
        user: req.user,
        isStudent: req.user.role === "student" ? true : false,
        isFaculty: req.user.role === "faculty" ? true : false,
    })
});


module.exports = Router;