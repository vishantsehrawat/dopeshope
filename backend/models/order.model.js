const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: ["Confirmed", "Cancelled", "Delivered"],
      default: "Confirmed",
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      mode: {
        type: String,
        required: true,
        enum: ["Cash-On-Delivery", "EMI", "Internet-Banking"],
      },
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel };
