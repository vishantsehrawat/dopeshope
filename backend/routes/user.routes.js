const express = require("express");
const {
  newRegistration,
  userLogin,
  resetPassword,
  saveNewPassword,
  verifyOtp,
  userlogout,
} = require("../controller/user.controller");
const { jwtAuth } = require("../middlewares/authMiddleware");
const { passport } = require("../config/googleOauth");
const userRouter = express.Router();

userRouter.get("/home", (req, res) => {
  try {
    res.status(200).send({ msg: "homeroute" });
  } catch (error) {
    res.status(500).send({ msg: "cannot get home route" });
  }
});
userRouter.post("/register", newRegistration);

userRouter.post("/login", userLogin);

userRouter.get("/resetUserPassword", jwtAuth, resetPassword);

userRouter.post("/saveNewPassword", jwtAuth, saveNewPassword);

userRouter.post("/verifyOtp", jwtAuth, verifyOtp);

userRouter.post("/logout", jwtAuth, userlogout);

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google will redirect to this route when it successfully authenticates the user
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/home", /// !add redirect url here
    failureRedirect: "/login", // !add redirect url here
  })
);

// for loggin out the user from google auth session
userRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/"); // !add redirect url here
});

module.exports = {
  userRouter,
};
