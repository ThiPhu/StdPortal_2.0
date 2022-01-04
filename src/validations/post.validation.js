const {check} = require('express-validator')
const {handleValidationResult} = require("../utils/handleValidationResult")

exports.image =  [ 
    check("image")
        .custom((value, {req}) => {
            const image = req.file
            console.log(image.mimetype)
            console.log((["image/jpeg", "image/gif","image/png"].filter((t) => {t == image.mimetype})))
            console.log((["image/jpeg", "image/gif","image/png"].filter((t) => {t == image.mimetype}).length == 0))
            if((["image/jpeg", "image/gif","image/png"].filter((t) => {t == image.mimetype}).length == 0)){
                throw new Error("Sai định dạng ảnh")
            } else {
                return true
            }   
        }),
        (req, res, next) => handleValidationResult(req, res, next)
]