const {check} = require('express-validator')
const {handleValidationResult} = require("../utils/handleValidationResult")

module.exports = [
    // check("username")
    //     .exists().withMessage("username rỗng!")
    //     .notEmpty().withMessage("username rỗng!"),
    check("password")
        .exists().withMessage("password rỗng!")
        .notEmpty().withMessage("password rỗng!"),
    check("role")
        .exists().withMessage("role rỗng!")
        .notEmpty().withMessage("role rỗng!"),
    (req, res, next) => handleValidationResult(req, res, next)
] 