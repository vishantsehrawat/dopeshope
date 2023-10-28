// email functionality working , your need to now work on verification by clicking on link sent on the mail
const path = require("path"); // Add this line to import the path module
const multer = require("multer");
const randomstring = require("randomstring");
const { UserModel } = require("../models/user.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");
require("dotenv");

// ^ route to register a user +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
          // console.log(
          // "🚀 ~ file: user.controller.js:110 ~ bcrypt.hash ~ result:",
          // result
          // );

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

  const accessToken = jwt.sign({ usedId: userid }, process.env.SECRET_KEY, {
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

// ^ User login handler function +++++++++++++++++++++++++++++++++++++++++++++++++++
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });
    // console.log(
    // "🚀 ~ file: user.controller.js:194 ~ userLogin ~ userExists:",
    // userExists
    // );

    if (userExists) {
      if (!userExists.isMailVerified) {
        return res.status(400).send({
          msg: "Kindly Verify Your Email ID.",

          error: "Email is Not Verified ",

          Success: false,
        });
      }
      if (userExists.isBlocked) {
        return res.status(400).send({
          msg: "Kindly Contact To Manager",

          error: "Your account is blocked by Admin.(Contact To manager.)",

          Success: false,
        });
      }

      bcrypt.compare(password, userExists.password, (err, result) => {
        if (!result) {
          return res.status(400).send({
            msg: "Kindly Enter correct Password. Password entered is Invalid !",

            Success: false,
          });
        } else {
          return res.status(200).send({
            msg: "Login Successfull.",

            Success: true,

            token: jwt.sign(
              { userId: userExists._id }, // this id will be used to uniquely identify the user so that only his data can be accessed
              process.env.SECRET_KEY,
              {
                expiresIn: "24h",
              }
            ),
          });
        }
      });
    } else {
      return res.status(400).send({
        msg: "Kindly Register yourself First. User Doesn't Exists at all.",

        error: "User Not Found! ",

        Success: false,
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: error.message,

      Success: false,

      msg: "Something Went Wrong !",
    });
  }
};

// ^ password reset for user +++++++++++++++++++++++++++++++++++++++++++++++++++

const resetPassword = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(
      "🚀 ~ file: user.controller.js:268 ~ resetPassword ~ token:",
      token
    );

    if (!token) {
      return res.status(401).send("<h1>Unauthorized. Login to continue</h1>");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      const otpCode = randomstring.generate(6);
      const user = await UserModel.findOne({ _id: decoded.userId });

      user.otp = {
        code: otpCode,
        expiration: new Date(+new Date() + 15 * 60 * 1000),
      };

      await user.save();

      const emailSubject = "Password Reset OTP";
      const emailText = `Your OTP for password reset is: ${otpCode}`;

      await sendPasswordResetEmail(user.email, emailSubject, emailText);

      // Retrieve the file path from the environment variable, or use a default path
      const filePath = path.join(
        __dirname,
        "..",
        process.env.FORGOT_PASSWORD_FILE_PATH || "./view/forgotPassword.html"
      );

      res.status(200).sendFile(filePath);
    } else {
      return res
        .status(404)
        .send(
          "<h1>Oops! This link is expired. Kindly generate a new link for password reset.</h1>"
        );
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).send("<h1>Error (400): An error occurred.</h1>");
  }
};

async function sendPasswordResetEmail(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.EMAIL_FOR_NODE_MAILER,
        pass: process.env.EMAIL_API_KEY_NODE_MAILER,
      },
    });

    const emailOptions = {
      from: process.env.DOPESHOPE_EMAIL,
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

// ^ save the new password that user resetted ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const saveNewPassword = async (req, res) => {
  const { userId } = req.body;
  const { password } = req.body;
  try {
    const userPresent = await UserModel.findById({ _id: userId });

    if (userPresent) {
      const hashPass = bcrypt.hashSync(password, 7);
      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { password: hashPass }
      );

      return res.status(200).send({
        msg: "Your Password has been changed Successfully.",
        Success: true,
      });
    } else {
      return res.status(400).send({
        msg: "Your Account does Not Exit",
        error: "User Not Found",
        Success: false,
      });
    }
  } catch (error) {
    return res.status(400).send({
      msg: "Something Went Wrong",
      error: error.message,
      Success: false,
    });
  }
};

// ^ function to verify otp stored inside the user model +++++++++++++++++++++++++++++++++++

const verifyOtp = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ Success: false, error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ Success: false, error: "Unauthorized" });
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ Success: false, error: "OTP is required" });
    }

    const user = await UserModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({ Success: false, error: "User not found" });
    }

    // Check if the provided OTP matches the one stored in the user's model
    if (user.otp.code === otp) {
      return res
        .status(200)
        .json({ Success: true, msg: "OTP verified successfully" });
    } else {
      return res
        .status(400)
        .json({ Success: false, error: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ Success: false, error: "Internal server error" });
  }
};

// ^ user logout route ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const userlogout = async (req, res) => {
  const token = req.headers["authorization"].trim().split(" ")[1];

  if (!token) {
    return res.status(400).send({
      msg: "Token Not Found.",

      error: "Token Not Found.",

      Success: false,
    });
  }

  try {
    const decoded = jwt.decode(token);
    console.log(
      "🚀 ~ file: user.controller.js:438 ~ userlogout ~ decoded:",
      decoded
    );
    const expireDate = new Date(decoded.exp * 1000);

    const newBlacklistToken = new BlacklistModel({
      token: token,
      expirationDate: expireDate,
      createdBy: decoded.userId,
    });

    await newBlacklistToken.save();

    return res.status(200).send({
      error: "no error",
      Success: true,
      msg: "Logout Successfull.",
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
      msg: "Something Wrong with the Token passed",
      Success: false,
    });
  }
};
// ^ user image upload route ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profileImages"); // Destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

const uploadProfileImage = async (req, res) => {
  const userId = req.body.userId; // Assuming "userId" is available in the request body

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    upload.single("profileImage")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload failed" });
      }

      user.image = req.file.path;

      await user.save();

      return res
        .status(200)
        .json({ message: "Profile image uploaded successfully" });
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      Success: false,
      msg: "Something Went Wrong!",
    });
  }
};

// ^ user image DELETE route ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const deleteProfileImage = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.image) {
      user.image = "";

      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Profile image deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      Success: false,
      msg: "Something Went Wrong!",
    });
  }
};

// ^ getting user wishlist ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const viewWishlist = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserModel.findById(userId).populate("wishlist");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while fetching the wishlist",
    });
  }
};

// ^ remove product from wishlist

const removeProductFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const productIndex = user.wishlist.indexOf(productId);

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found in wishlist" });
    }

    user.wishlist.splice(productIndex, 1);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while removing the product from the wishlist",
    });
  }
};

// ~ ADMIN only routes below ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ~ ADMIN only route to get all users  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = {};
    if (role) {
      filter.role = role;
    }
    const users = await UserModel.find(filter);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found matching the specified role" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      Success: false,
      msg: "Something Went Wrong!",
    });
  }
};

// ~ ADMIN only route to update user role  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const updateUserRole = async (req, res) => {
  try {
    const userId = req.body.userId;
    const newRole = req.body.role;
    if (newRole !== "user" && newRole !== "admin") {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = newRole;
    await user.save();

    return res.status(200).json({ message: "User role updated" });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      Success: false,
      msg: "Something Went Wrong!",
    });
  }
};

// ~ ADMIN only route to Block user ACCOUNT  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const blockUserAccount = async (req, res) => {
  try {
    const accountId = req.params.accountId; // getting account id as params
    const user = await UserModel.findById(accountId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = true;

    await user.save();

    return res.status(200).json({ message: "User account blocked" });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      Success: false,
      msg: "Something Went Wrong!",
    });
  }
};

// ~ ^ ADMIN only route to reACTIVATE user ACCOUNT  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const activateUserAccount = async (req, res) => {
  try {
    const accountId = req.params.accountId; // getting account id as params

    const user = await UserModel.findById(accountId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isBlocked = false;
    await user.save();

    return res.status(200).json({ message: "User account activated" });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      Success: false,
      msg: "Something Went Wrong!",
    });
  }
};
// ~ ADMIN only routes above ---------------------------------------------------------------

module.exports = {
  newRegistration,
  userLogin,
  resetPassword,
  saveNewPassword,
  verifyOtp,
  userlogout,
  uploadProfileImage,
  deleteProfileImage,
  getAllUsers,
  updateUserRole,
  blockUserAccount,
  activateUserAccount,
  viewWishlist,
  removeProductFromWishlist,
};
