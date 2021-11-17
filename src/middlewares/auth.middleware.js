// Kiểm tra session sử dụng token 
const mongoose = require("mongoose")
const User = require("../models/User.model")
const {genToken, verifyToken} = require("../utils/jwt")

exports.userAuth = async (req, res, next)=>{
    const {access_token} = req.cookies

    try{
        if(access_token){
            const {id} = verifyToken(access_token)
            console.log(id)
            if(id&&mongoose.isValidObjectId(id)){
                const user = await User.findById(id)
                if(user){
                    req.user = user
                    res.cookie("access_token", genToken({id}))
                    return next()
                }
            }
        }
        return res.redirect("/login")
    }
    // Chuyển về trang đăng nhập nếu không tồn tại session token
    catch(err){
        console.log("Phiên đăng nhập không hợp lệ", err)
        return res.redirect("/login")
    }
}