const User = require("../models/User.model")
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

exports.create = async (req, res, next) =>{
   const { username, password, role}  = req.body

   console.log(username, password, role)
    // Generate salt
    const salt = await bcrypt.genSalt()
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, salt)

   try{
        const user = await User.create({
            username,
            password : hashedPassword,
            role
        })
        return res.json({
            ok: true,
            msg: "Tạo người dùng mới thành công!",
            data: user
        })
   }
   catch(err) { next(err) }
}

// exports.createFromGoogleAuth = async (req, res, next) =>{
//     passport.use(
//         new GoogleStrategy({
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: "/api/auth/google/callback"
//         }
//     )
// }
