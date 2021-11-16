const User = require("../models/User.model")


exports.create = (req,res)=>{
    const {loginUserName, loginPassword} = req.body
    console.log(loginUserName, loginPassword)

}