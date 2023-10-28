const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },

    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },

    rating: { type: Number, default: 0 },
    totalReviewCount: { type: Number, default: 0 },
    totalReviewSum: { type: Number, default: 0 },

    seller: {
      name: { type: String },
      contactEmail: { type: String },
    },

    attributes: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],

    variations: [
      {
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
      },
    ],

    availability: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },

    brand: { type: String },

    weight: { type: Number },

    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },

    tags: [String],
    shipping: {
      weight: { type: Number },
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
      },
      shippingMethod: { type: String },
      estimatedDelivery: { type: String },
    },
  },
  {
    versionKey: false,
  }
);

const ProductModel = mongoose.model("product", productSchema);

module.exports = { ProductModel }; //* using named export instead of default export
