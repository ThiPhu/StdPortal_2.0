const {check} = require('express-validator')
const {handleValidationResult} = require("../utils/handleValidationResult")

exports.facultyUpdate = [
    // Can be named anything
    check("checkRole")
        .custom((value, {req}) => {
            const {user: {role}} = req.user

            switch (role) {
                case "falcuty":
                    const {password, passwordConfirm} = req.body

                    if (password!==passwordConfirm) {
                        throw new Error("Mật khẩu không khớp!")
                    }
                    break;

                case "student":
                    const a =1
                    break;

            return true
            }
        }),
    // check("password")
    //     .exists()
    //     .withMessage("Vui lòng cung cấp mật khẩu!")
    //     .notEmpty()
    //     .withMessage("Mật khẩu sai định dạng!"),
    // check("passwordConfirm")
    //     .exists()
    //     .withMessage("Vui lòng cung cấp mật khẩu!")
    //     .notEmpty()
    //     .custom((value,{req}) => { value === req.body.password})
    //     .withMessage("Mật khẩu không khớp!"),
    (req, res, next) => handleValidationResult(req, res, next)
]