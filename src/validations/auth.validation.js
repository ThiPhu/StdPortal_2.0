const {check} = require("express-validator")
const {handleValidationResult} = require("../utils/handleValidationResult")

module.exports = [
    check("loginUserName")
        .exists().withMessage("Vui lòng cung cấp tên đăng nhập!")
        .notEmpty().withMessage("Vui lòng cung cấp tên đăng nhập!"),
    check("loginPassword")
        .exists().withMessage("Vui lòng điền mật khẩu!")
        .notEmpty().withMessage("Vui lòng điền mật khẩu!"),
    (req, res, next) => handleValidationResult(req,res,next)
]