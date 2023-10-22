const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    // Image information
    image: { type: String, required: true },

    // Product details
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },

    // Product ratings and reviews
    rating: { type: Number, default: 0 },
    totalReviewCount: { type: Number, default: 0 },
    totalReviewSum: { type: Number, default: 0 },

    // Seller information (if applicable)
    seller: {
      name: { type: String },
      contactEmail: { type: String },
    },

    // Product attributes (e.g., size, color, etc.)
    attributes: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],

    // Product variations (if applicable, e.g., different sizes)
    variations: [
      {
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
      },
    ],

    // Product availability (e.g., in stock, out of stock)
    availability: { type: String, default: "In Stock" },

    // Product creation and update timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },

    // Product brand
    brand: { type: String },

    // Product weight (if applicable)
    weight: { type: Number },

    // Product dimensions (if applicable)
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },

    // Product tags (keywords for search and categorization)
    tags: [String],

    // Shipping information
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

module.exports = { ProductModel }; //* using named export instead of named export
