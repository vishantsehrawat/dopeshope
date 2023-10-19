const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isMailVerified: { type: Boolean, default: false },
    image: { type: String, default: 'https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png' },
    s3Url: { type: String },
    s3UrlExpireDate: { type: Date },
    isBlocked: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
