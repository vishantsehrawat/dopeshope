const express = require("express");
const { newRegistration } = require("../controller/user.controller");


const userRouter = express.Router();

userRouter.post("/register",newRegistration)

module.exports = {
    userRouter
}