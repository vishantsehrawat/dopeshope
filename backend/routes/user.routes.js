const express = require("express");
const {
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
} = require("../controller/user.controller");
const { jwtAuth } = require("../middlewares/authMiddleware");
const { passport } = require("../config/googleOauth");
const { adminRoleCheck } = require("../middlewares/adminRbac.middleware");
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

userRouter.get("/auth/google", async (req, res, next) => {
  try {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  } catch (err) {
    res.redirect("/error");
    console.log(err.message);
  }
});

// google will redirect to this route when it successfully authenticates the user
userRouter.get("/auth/google/callback", async (req, res, next) => {
  try {
    passport.authenticate("google", {
      successRedirect: "/home",
      failureRedirect: "/login",
    })(req, res, next);
  } catch (err) {
    res.redirect("/error"); // !add redirect url here
    console.log(err.message);
  }
});

// for loggin out the user from google auth session
userRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/"); // !add redirect url here
});

// ^ updating profile picture ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
userRouter.post("/uploadProfileImage", jwtAuth, uploadProfileImage);

// ^ DELETING profile picture ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
userRouter.delete("/deleteProfileImage", jwtAuth, deleteProfileImage);

// ~ ADMIN only routes ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//^ getting list of all the users ++++++++++++++++++++++++++++++++++++++++
userRouter.get("/getAllUsers", jwtAuth, adminRoleCheck, getAllUsers);

//^ updating user role ++++++++++++++++++++++++++++++++++++++++
userRouter.put("/updateUserRole", jwtAuth, adminRoleCheck, updateUserRole);

//^ blocking user account ++++++++++++++++++++++++++++++++++++++++
userRouter.patch(
  "/blockUserAccount/:accountId",
  jwtAuth,
  adminRoleCheck,
  blockUserAccount
);

//^ activating user account ++++++++++++++++++++++++++++++++++++++++
userRouter.patch(
  "/activateUserAccount/:accountId",
  jwtAuth,
  adminRoleCheck,
  activateUserAccount
);

module.exports = {
  userRouter,
};
