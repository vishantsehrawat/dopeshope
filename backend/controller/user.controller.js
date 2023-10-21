// email functionality working , your need to now work on verification by clicking on link sent on the mail

const { UserModel } = require("../models/user.model");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv");

const newRegistration = async (req, res) => {
  let {
    email,
    name,
    password,
    location,
    gender,
    contact,
    role = "user",
  } = req.body;
  // console.log(
  // "🚀 ~ file: user.controller.js:9 ~ newRegistration ~ req.body:",
  // req.body
  // );
  gender = gender.toLowerCase();
  if (!email || !name || !password || !location || !contact || !gender) {
    return res.status(400).send({
      error: "Kindly Provide All Required Details for Registration.",
      Success: false,
    });
  }

  if (!(gender == "male" || gender == "female")) {
    return res.status(400).send({
      msg: "Kindly Provide a Valid Gender details as : { Male/Female } only.",
      Success: false,
    });
  }

  //   const isAdmin = false;
  let userVerifiedFlag = true;

  const isUserPresent = await UserModel.findOne({ email });
  // console.log(
  // "🚀 ~ file: user.controller.js:41 ~ newRegistration ~ isUserPresent:",
  // isUserPresent
  // );
  try {
    if (isUserPresent) {
      userVerifiedFlag = false;
      if (isUserPresent.isMailVerified) {
        return res.status(400).send({
          Success: false,
          msg: "User is Already Registered with us. Kindly Login using crendentials.",
        });
      } else {
        // * will send the mail to user for verification if user is not verified
        const result = await sendEmailForVerification(
          isUserPresent._id,
          name,
          email
        );
        // console.log(
        // "🚀 ~ file: user.controller.js:56 ~ newRegistration ~ result:",
        // result
        // );

        if (result) {
          return res.status(400).send({
            Success: true,
            msg: "Kindly Verify Your Email Id.(Email Sent Successfully)",
          });
        } else {
          return res.status(400).send({
            Success: false,
            msg: "Something Went Wrong .Try After Some Time",
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({
      error: error.message,
      Success: false,
      msg: "Internal Server Error",
    });
  }

  if (userVerifiedFlag) {
    bcrypt.hash(password, 7, async (err, hash) => {
      if (err) {
        return res.status(400).send({
          msg: " Oops ! Something Went Wrong here. Kindly retry once after sometime.",
          error: err.message,
          Success: false,
        });
      } else {
        try {
          const user = new UserModel({
            email,
            name,
            password: hash,
            location,
            gender,
            contact,
            role,
          });

          await user.save();

          // Email Send For Verification
          const result = await sendEmailForVerification(user._id, name, email);
          console.log(
            "🚀 ~ file: user.controller.js:110 ~ bcrypt.hash ~ result:",
            result
          );

          if (result) {
            return res.status(400).send({
              Success: true,
              msg: "Your Registration has been successfull. (Kindly Verify Your Email)",
            });
          } else {
            return res.status(400).send({
              Success: false,
              msg: "Something Went Wrong. Try After Some Time",
            });
          }
        } catch (error) {
          return res.status(400).send({
            error: error.message,
            Success: false,
            msg: `Something Went Wrong. (${error.message})`,
          });
        }
      }
    });
  }
};

// function for handling mailing functionality
function sendEmailForVerification(userid, name, email) {
  const mailExpireTime = "6h";
  // console.log(
  // "🚀 ~ file: user.controller.js:114 ~ sendEmailForVerification ~ userid:",
  // userid
  // );

  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.EMAIL_FOR_NODE_MAILER,
      pass: process.env.EMAIL_API_KEY_NODE_MAILER,
    },
  });

  //   const BaseUrl_Backend = process.env.backendUrl;

  const accessToken = jwt.sign({ UserID: userid }, process.env.SECRET_KEY, {
    expiresIn: mailExpireTime,
  });

  let mailOptions = {
    from: process.env.EMAIL_FOR_NODE_MAILER, // * email will be sent from this email
    to: email, //* email will be sent to this user email
    subject: " DOPESHOP registration verification",
    html: `<p>Hi ${name} <br> Welcome to DOPESHOP <br/> Please click here to 
    your Email. This link will expire in ${mailExpireTime}</p>`,
  };
  {
    /* <a href="${BaseUrl_Backend}/user/confirm-email/${accessToken}">verify</a>   */
  }

  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("While Email Send error: ", err);
        reject(false);
      } else {
        console.log(`Mail sent successfully!`);
        console.log(info);
        resolve(true);
      }
    });
  });
}

module.exports = {
  newRegistration,
};
