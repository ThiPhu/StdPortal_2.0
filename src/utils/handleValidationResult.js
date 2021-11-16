const {validationResult} = require("express-validator")

exports.handleValidationResult = (req,res,next) =>{
    const {errors} = validationResult(req)
    // if has error
    if(errors.length > 0){
        console.log("Validate Error", errors[0])

        return res 
            .status(400)
            .json({
                ok: false,
                msg: errors[0].msg
            })
    }
    next()
}