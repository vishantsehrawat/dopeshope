require("dotenv").config();

const passport = require("passport");

const crypto = require("crypto");
const { UserModel } = require("../models/user.model");
const randomPassword = (byte = 32) => crypto.randomBytes(byte).toString("hex");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DEPLOYED_URL}/user/auth/google/callback`,
    },

    async function (accessToken, refreshToken, profile, cb) {
      try {
        let email = profile._json.email;

        const user = await UserModel.findOne({ email });

        //console.log(user)

        if (!user) {
          console.log("adding new user");
          console.log(
            "🚀 ~ file: googleOauth.js:14 ~ process.env.GOOGLE_CLIENT_ID:",
            process.env.GOOGLE_CLIENT_ID
          );
          console.log(
            "🚀 ~ file: googleOauth.js:16 ~ process.env.GOOGLE_CLIENT_SECRET:",
            process.env.GOOGLE_CLIENT_SECRET
          );
          let newuser = new UserModel({
            email,
            name: profile._json.name,
            password: randomPassword(),
            gender: "null",
            role: "user",
            contact: "-",
            location: "-",
            isMailVerified: true,
          });

          await newuser.save();

          return cb(null, newuser);
        } else {
          console.log("user is present db");
          if (user.isBlocked) {
            return cb(null, "Blocked User");
          } else {
            return cb(null, user);
          }
        }
      } catch (error) {
        console.log(error);
      }

      //console.log(profile)
    }
  )
);

module.exports = { passport };
