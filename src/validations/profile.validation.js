const {check} = require('express-validator')
const {handleValidationResult} = require("../utils/handleValidationResult")

exports.update = [
    // Can be named anything
    check("checkRole")
        .custom((value, {req}) => {
            const {role} = req.user
            // Condition check
            switch (role) {
                case "falcuty":
                    const {password, passwordConfirm} = req.body

                    if (!password || password.length < 0){
                        throw new Error("Vui lòng nhập mật khẩu!")
                    }

                    if (!passwordConfirm || passwordConfirm.length < 0){
                        throw new Error("Vui lòng xác nhận mật khẩu!")
                    }

                    if (password!==passwordConfirm) {
                        throw new Error("Mật khẩu xác nhận không khớp!")
                    }
                    break;

                case "student":
                    
                    break;

            }
            return true
        }),
    (req, res, next) => handleValidationResult(req, res, next)
]