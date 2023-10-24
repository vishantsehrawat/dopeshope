const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true, // no duplication of blacklisted tokens
      trim: true, // trimming of tokens like the trim() method in js
    },
    expirationDate: {
      type: Date, // can add the date on which we want the token to expire
      required: true,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // reference to the user who blacklisted the token
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = { BlacklistModel }; // named expor t
