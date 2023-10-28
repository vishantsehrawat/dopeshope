const { ProductModel } = require("../models/product.model");

require("dotenv").config();

// ^ create a new product
const createProduct = async (req, res) => {
  try {
    const productData = req.body; // Assuming product data is sent in the request body

    // Create a new product using the ProductModel
    const product = new ProductModel(productData);

    // Save the product to the database
    await product.save();

    return res.status(201).json({
      msg: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "An error occurred while creating the product",
      error: error.message,
      success: false,
    });
  }
};

// ^ get a list of all products
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    return res.status(200).json({
      msg: "Retrieved all products successfully",
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "An error occurred while retrieving products",
      error: error.message,
      success: false,
    });
  }
};

// ^ update a product
const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updatedData = req.body;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    for (const key in updatedData) {
      if (Object.hasOwnProperty.call(updatedData, key)) {
        product[key] = updatedData[key];
      }
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while updating the product",
    });
  }
};

// ^ delete a product
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    await product.remove();

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while deleting the product",
      });
  }
};

module.exports = { createProduct, getAllProducts };
