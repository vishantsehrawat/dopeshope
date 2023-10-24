const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiration: { type: Date, expires: 900 }, // otp will be delted from db in 15 mins
  used: Boolean,
});

const OtpModel = mongoose.model("otp", otpSchema);

module.exports = { OtpModel };
