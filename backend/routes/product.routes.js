const express = require("express");
const { jwtAuth } = require("../middlewares/authMiddleware");
const { ProductModel } = require("../models/product.model");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  searchProducts,
  addProductReview,
  addProductToWishlist,
} = require("../controller/product.controller");

const productRouter = express.Router();

//^ Route to create a new product ++++++++++++++++++++++++++++++++++
productRouter.post("/create", jwtAuth, createProduct);

//^ Route to get all products ++++++++++++++++++++++++++++++++++
productRouter.get("/getAllProducts", jwtAuth, getAllProducts);

//^ update a product ++++++++++++++++++++++++++++++++++
productRouter.put("/update/:productId", jwtAuth, updateProduct);

//^ search a product ++++++++++++++++++++++++++++++++++
productRouter.get("/searchProduct", jwtAuth, searchProducts);

// ^ add reviews ++++++++++++++++++++++++++++++++++
productRouter.post("/products/:productId/reviews", jwtAuth, addProductReview);

//  ^ add product to wishlist ++++++++++++++++++++++++++++++++++
productRouter.post("/wishlist/add/:productId", jwtAuth, addProductToWishlist);

module.exports = { productRouter };
