const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other","null"],
      default: "Other",
    },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isMailVerified: { type: Boolean, default: false },
    image: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    },
    s3Url: { type: String },
    s3UrlExpireDate: { type: Date },
    isBlocked: { type: Boolean, default: false },
    otp: {
      // for resetting password
      code: { type: String }, // OTP code
      expiration: {
        type: Date,
        default: function () {
          return new Date(+new Date() + 15 * 60 * 1000 * 1000); // 15 minutes from creation // ! added extra 1000 during dev for testing , remove in production
        },
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
