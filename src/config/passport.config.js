//Passport js 
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User.model")

// Google Oauth 2.0 w Passport JS 
passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("ACCESS TOKEN",accessToken);
      console.log(profile)
      // Check if user exist
      if(profile.id){
          const user = await User.findOne({googleId: profile.id})
          if(user){
              done(null, user);
              // res.cookie("access_token", genToken({id: user["_id"].toString()}), {httpOnly: true})
              // res.redirect("/home")
          } else {
                  const newUser = await User.create({
                      googleId: profile.id,
                      email: profile.emails[0].value,
                      fullname: profile.displayName,
                      avatar: profile.photos[0].value,
                  })
              // const user_created = await User.findOne({googleId: profile.id})
              // res.cookie("access_token", genToken({id: user_created["_id"].toString()}), {httpOnly: true})
              done(null, user);
              // res.redirect("/home")
          }
        }
      }
  )
);
  