const express = require("express");
const { newRegistration, userLogin } = require("../controller/user.controller");

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

module.exports = {
  userRouter,
};
