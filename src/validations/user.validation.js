const {check} = require('express-validator')
const {handleValidationResult} = require("../utils/handleValidationResult")

exports.create = [
    // check("username")
    //     .exists().withMessage("username rỗng!")
    //     .notEmpty().withMessage("username rỗng!"),
    check("password")
        .exists().withMessage("password rỗng!")
        .notEmpty().withMessage("password rỗng!"),
    check("role")
        .exists().withMessage("role rỗng!")
        .notEmpty().withMessage("role rỗng!"),
    check("unit")
        .exists().withMessage("Đơn vị rỗng!")
        .notEmpty().withMessage("Đơn vị rỗng!"),
    (req, res, next) => handleValidationResult(req, res, next)
]

exports.update = [
    check("password")
        .exists().withMessage("password rỗng!")
        .notEmpty().withMessage("password rỗng!"),
    check("unit")
        .exists().withMessage("Đơn vị rỗng!")
        .notEmpty().withMessage("Đơn vị rỗng!"),
    (req, res, next) => handleValidationResult(req, res, next)
]