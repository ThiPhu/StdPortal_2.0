const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


exports.get = async (req, res, next) => {
    const {userId} = req.params
    // get userid from session
    const {_id}  = req.user
    try{
      const user = await User.find({"_id":userId}).populate("unit")
      if(user){
        // Check is owner by check validate token
        let isOwner = false;

        if( _id.toString() === userId){
          isOwner = true;
        }
        
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
    const {_id} = req.user
    console.log("USER",req.user)

    // Check is owner by check validate token
    let isOwner = false;

    if(_id.toString() === userId){
      isOwner = true;
    }

    if(isOwner){
        try{
            if(req.user.role == "faculty"){
              const update = req.body;

              // Generate salt
              const salt = await bcrypt.genSalt();
              const hashedPassword = await bcrypt.hash(update.password,salt)
              update.password = hashedPassword

              const user = await User.findByIdAndUpdate({_id: userId}, update)

              if(user){
                return res.json({
                  ok: true,
                  msg: "Cập nhật người dùng thành công!"
                })
              } else {
                return res.json({
                  ok: false,
                  msg: "Cập nhật người dùng thất bại!"
                })
              }
            }

            if(req.user.role == "student"){
                const update = req.body

                const user = await User.findByIdAndUpdate({_id: userId}, update)
                
            }
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

