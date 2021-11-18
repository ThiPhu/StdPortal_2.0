//Passport js 
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User.model")
const passport = require("passport")


// Google Oauth 2.0 w Passport JS 
passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user exist
      if(profile.id){
          User.findOne({googleId: profile.id}, async function(err,user){
            if(err) {return done(err)}
            //If user exist
            if(user){
              done(null, user);
            } else {
                const domainRegex = /^[A-Za-z0-9._%+-]+@student.tdtu.edu.vn/
                if(!profile.emails[0].value.match(domainRegex)){
                  return done(null, false, {message: "Vui lòng sử dụng mail sinh viên!"})
                } 
                else{ 
                        const newUser = await User.create({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            fullname: profile.displayName,
                            avatar: profile.photos[0].value,
                        })
                        return done(null, newUser);
                      }
            }
          }
        )
      }
    }
  )
);
  