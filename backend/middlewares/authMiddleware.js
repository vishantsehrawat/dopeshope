require("dotenv").config();
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");
const { UserModel } = require("../models/user.model");

const jwtAuth = async (req, res, next) => {
  const authToken = req.headers["authorization"];

  if (!authToken) {
    return res.status(400).json({
      msg: "Kindly Login First to Access Protected Routes.",
      error: "Invalid Access Detected",
      Success: false,
    });
  }

  //   const token = authToken.trim().split(" ")[1];//for bearer token
  const token = authToken.trim().split(" ")[0]; // for normal token

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      const isBlacklist = await BlacklistModel.findOne({ token: token });
      if (isBlacklist) {
        return res.status(400).json({
          error: "Your Access Token is Blacklisted. Kindly Login Again.",
          msg: "Kindly Login Again",
          Success: false,
        });
      }

      const userInfo = await UserModel.findById(decoded.createdBy);
      if (userInfo.isBlocked) {
        return res.status(400).json({
          error: "Your Account is Blocked by Admin. Contact the manager.",
          msg: "User is Blocked",
          Success: false,
        });
      }

      req.body.userId = decoded.userId;
      next();
    } else {
      return res.status(400).json({
        error: "Token found to be Invalid",
        Success: false,
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      msg: error.message,
      Success: false,
    });
  }
};

module.exports = { jwtAuth };
