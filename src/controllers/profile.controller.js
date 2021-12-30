const User = require("../models/User.model");
const mongoose = require("mongoose");
const {verifyToken} = require("../utils/jwt");
const bcrypt = require('bcrypt');



exports.get = async (req, res, next) => {
    const {userId} = req.params
    try{
      const user = await User.find({"_id":userId}).populate("unit")
      if(user){
        // Check is owner by check validate token
        const {access_token} = req.cookies
        let isOwner = false;

        const {id} = verifyToken(access_token)
        console.log("TOKEN ID",id)

        if(id && mongoose.isValidObjectId(id)){
          if(id == userId){
            isOwner = true;
          }
        }

        console.log(mongoose.isValidObjectId(id))

        console.log(id == req.user._id.toString())

        console.log("USER INFO",req.user)

        console.log("USER ID", req.user._id.toString())

        console.log("IS OWNER", isOwner)

        return res.render('user/profile', {
            user: req.user, // Current user logging in
            isProfilePage: true,
            isOwner: isOwner,
            currentProfile: user,
            admin: req.user.role === 'admin' ? true : false,
        });
      }
      return res.status(404).json({
        ok: false,
        msg: "Không tìm thấy người dùng!"
      })
    } catch(err){
      next(err)
    }
}

exports.update = async (req,res,next) => {
    const {userId} = req.params;

    console.log("USER",req.user)

    console.log(userId)
    // Check is owner by check validate token
    const {access_token} = req.cookies
    let isOwner = false;

    const {id} = verifyToken(access_token)
    console.log("TOKEN ID",id)

    if(id && mongoose.isValidObjectId(id)){
        if(id == userId){
            isOwner = true;
        }
    }
    if(isOwner){
        try{
            if(req.user.role == "faculty"){

            }

            if(req.user.role == "student"){
                
            }

            // const update = req.body;
            // // password
            // if(update.password === null){
            //     delete update.password
            // }else{
            //     // Generate salt
            //     const salt = await bcrypt.genSalt();
            //     // Hash password with bcrypt
            //     const hashedPassword = await bcrypt.hash(update.password, salt);
            //     update.password = hashedPassword
            // }

            // // Remove null fields
            // update.avatar == null && delete update.avatar
            // update.class == null && delete update.class
            // update.unit == null && delete update.unit

            // console.log(update)

            // const user = await User.findByIdAndUpdate(
            //     {_id: userId},
            //     update
            // )

            // if(user){
            //     return res.json({
            //         ok: true,
            //         msg: "Cập nhật thành công!"
            //     })
            // }else{
            //     return res.json({
            //         ok: false,
            //         msg: "Cập nhật thất bại!"
            //     })
            // }
        }catch (err){
            next(err)
        }
    } else {
        return res.status(401).json({
            ok: "false",
            msg: "Không có thẩm quyền!"
        })
    }
}

