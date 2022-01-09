const {check} = require('express-validator')
const {handleValidationResult} = require("../utils/handleValidationResult")

exports.update = [
    // Can be named anything
    check("checkRole")
        .custom((value, {req}) => {
            const role = req.user.role
            console.log(role) 
            // Condition check
            switch (role) {
                case "faculty":
                    const {password, passwordConfirm} = req.body
                    console.log("from validation",password, passwordConfirm)
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

                    console.log(req.body)
                    const {fullname,class:Class,unit} = req.body
                    const image = req.file
                    // if(!fullname && !Class && !unit && !image){
                    //     throw new Error("Dữ liệu rỗng")
                    // }

                    // Avatar validation
                    console.log("AVATAR",image)
                    if(image){
                        console.log(!(image.mimetype.includes("image")));
                        if(!(image.mimetype.includes("image"))){
                            throw new Error("Sai định dạng ảnh")
                        }
    
                        if(image.size > 5000000){
                            throw new Error("Kích thước ảnh vượt quá 5Mb")
                        }
                    }
                    break;

            }
            return true
        }),
    (req, res, next) => handleValidationResult(req, res, next)
]