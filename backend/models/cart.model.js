const mongoose = require("mongoose");
const ProductModel = require("./product.model");
const UserModel = require("./user.model");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: ProductModel,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CartModel = mongoose.model("cart", cartSchema);

module.exports = { CartModel };
